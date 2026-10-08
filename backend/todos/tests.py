from unittest.mock import patch

from rest_framework.test import APITestCase

from authentication.models import FirebaseUser

from .models import TodoItem, TodoList


# test dat gebruikers alleen hun eigen todos zien en admins alles
class TodoAccessTests(APITestCase):
    def setUp(self):
        self.alice = FirebaseUser.objects.create(firebase_uid='alice', email='alice@test.nl')
        self.bob = FirebaseUser.objects.create(firebase_uid='bob', email='bob@test.nl')
        self.admin = FirebaseUser.objects.create(
            firebase_uid='admin', email='admin@test.nl', role=FirebaseUser.Role.ADMIN,
        )
        self.alice_list = TodoList.objects.create(title='Alice', owner=self.alice)
        self.alice_item = TodoItem.objects.create(todo_list=self.alice_list, title='Taak')
        self.bob_list = TodoList.objects.create(title='Bob', owner=self.bob)

        # firebase niet echt aanroepen het token is gewoon de firebase uid van de gebruiker
        patcher = patch(
            'authentication.firebase_auth.get_user_from_token',
            side_effect=lambda token: FirebaseUser.objects.get(firebase_uid=token),
        )
        patcher.start()
        self.addCleanup(patcher.stop)

    def login(self, user):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {user.firebase_uid}')

    def test_requires_login(self):
        self.assertEqual(self.client.get('/api/todolists/').status_code, 401)

    def test_user_only_sees_own_lists(self):
        self.login(self.alice)
        titles = [todo_list['title'] for todo_list in self.client.get('/api/todolists/').json()['results']]
        self.assertEqual(titles, ['Alice'])

    def test_user_cannot_touch_other_users_todos(self):
        self.login(self.bob)
        self.assertEqual(self.client.get(f'/api/todolists/{self.alice_list.id}/').status_code, 404)
        self.assertEqual(self.client.delete(f'/api/todolists/{self.alice_list.id}/').status_code, 404)
        self.assertEqual(
            self.client.patch(f'/api/todoitems/{self.alice_item.id}/', {'completed': True}).status_code, 404,
        )
        self.assertEqual(
            self.client.post(f'/api/todolists/{self.alice_list.id}/items/', {'title': 'x'}).status_code, 404,
        )

    def test_assigned_user_can_see_and_update_task(self):
        self.alice_item.assigned_to = self.bob
        self.alice_item.save()

        self.login(self.bob)
        titles = [todo_list['title'] for todo_list in self.client.get('/api/todolists/').json()['results']]
        self.assertCountEqual(titles, ['Alice', 'Bob'])
        response = self.client.patch(f'/api/todoitems/{self.alice_item.id}/', {'completed': True})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.delete(f'/api/todoitems/{self.alice_item.id}/').status_code, 403)

    def test_admin_can_view_and_edit_all(self):
        self.login(self.admin)
        self.assertEqual(self.client.get('/api/todolists/').json()['count'], 2)
        response = self.client.patch(f'/api/todolists/{self.alice_list.id}/', {'title': 'Nieuw'})
        self.assertEqual(response.status_code, 200)
        response = self.client.patch(
            f'/api/todoitems/{self.alice_item.id}/', {'assigned_to': self.bob.id}, format='json',
        )
        self.assertEqual(response.json()['assigned_to_detail']['email'], 'bob@test.nl')

    def test_lists_are_paginated_with_counts(self):
        for number in range(12):
            TodoList.objects.create(title=f'Lijst {number}', owner=self.alice)
        TodoItem.objects.create(todo_list=self.alice_list, title='Klaar', completed=True)

        self.login(self.alice)
        first_page = self.client.get('/api/todolists/').json()
        self.assertEqual(first_page['count'], 13)
        self.assertEqual(len(first_page['results']), 10)
        self.assertIsNotNone(first_page['next'])

        second_page = self.client.get('/api/todolists/?page=2').json()
        self.assertIsNone(second_page['next'])
        alice_list = next(item for item in second_page['results'] if item['title'] == 'Alice')
        self.assertEqual((alice_list['item_count'], alice_list['done_count']), (2, 1))

    def test_items_can_be_filtered(self):
        TodoItem.objects.create(todo_list=self.alice_list, title='Klaar', completed=True)

        self.login(self.alice)
        url = f'/api/todolists/{self.alice_list.id}/items/'
        self.assertEqual(self.client.get(url).json()['count'], 2)
        self.assertEqual([item['title'] for item in self.client.get(f'{url}?completed=true').json()['results']], ['Klaar'])
        self.assertEqual([item['title'] for item in self.client.get(f'{url}?completed=false').json()['results']], ['Taak'])

    def test_stats(self):
        self.alice_item.assigned_to = self.alice
        self.alice_item.save()

        self.login(self.alice)
        self.assertEqual(
            self.client.get('/api/todostats/').json(),
            {'lists': 1, 'open_tasks': 1, 'assigned_to_me': 1},
        )

    def test_only_admin_manages_users(self):
        self.login(self.alice)
        self.assertEqual(self.client.get('/api/users/').status_code, 200)
        self.assertNotIn('role', self.client.get('/api/users/').json()[0])
        self.assertEqual(self.client.post('/api/users/', {}).status_code, 403)
        self.assertEqual(self.client.delete(f'/api/users/{self.bob.id}/').status_code, 403)

        self.login(self.admin)
        response = self.client.patch(f'/api/users/{self.bob.id}/', {'role': 'admin'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.delete(f'/api/users/{self.admin.id}/').status_code, 403)
