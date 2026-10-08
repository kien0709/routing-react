from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import TodoItem, TodoList
from .pagination import TodoItemPagination, TodoListPagination
from .serializers import TodoItemSerializer, TodoListSerializer


# admins zien alles andere gebruikers alleen hun eigen lijsten
# en lijsten waarin een taak aan hen is toegewezen
def visible_lists(user):
    lists = TodoList.objects.select_related('owner')
    if user.is_admin:
        return lists
    # het tellen van de taken
    assigned_list_ids = TodoItem.objects.filter(assigned_to=user).values('todo_list')
    return lists.filter(Q(owner=user) | Q(pk__in=assigned_list_ids))


# telt per lijst hoeveel taken er zijn en hoeveel daarvan klaar zijn
# https://docs.djangoproject.com/en/stable/topics/db/aggregation/
def with_counts(lists):
    return lists.annotate(
        item_count=Count('items'),
        done_count=Count('items', filter=Q(items__completed=True)),
    )


# alleen de eigenaar of een admin mag een lijst aanpassen
def can_manage_list(user, todo_list):
    return user.is_admin or todo_list.owner_id == user.id


# get api todolists geeft jouw lijsten per pagina nieuwste eerst en post maakt een nieuwe lijst met jou als eigenaar
class TodoListListCreateView(generics.ListCreateAPIView):
    serializer_class = TodoListSerializer
    pagination_class = TodoListPagination

    def get_queryset(self):
        return with_counts(visible_lists(self.request.user)).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# get patch en delete api todolists id om een lijst te bekijken hernoemen of verwijderen
class TodoListDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoListSerializer

    def get_queryset(self):
        return with_counts(visible_lists(self.request.user))

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method not in ('GET', 'HEAD', 'OPTIONS') and not can_manage_list(request.user, obj):
            raise PermissionDenied('Alleen de eigenaar kan deze lijst aanpassen.')


# get api todolists id items geeft de taken van een lijst per pagina nieuwste eerst
# post voegt een taak toe aan de lijst
class TodoItemListCreateView(generics.ListCreateAPIView):
    serializer_class = TodoItemSerializer
    pagination_class = TodoItemPagination

    def get_todo_list(self):
        return get_object_or_404(visible_lists(self.request.user), pk=self.kwargs['todo_list_pk'])

    def get_queryset(self):
        items = TodoItem.objects.filter(todo_list=self.get_todo_list()).select_related('assigned_to')

        # filter all open of done uit de frontend
        completed = self.request.query_params.get('completed')
        if completed in ('true', 'false'):
            items = items.filter(completed=completed == 'true')

        return items.order_by('-created_at')

    def perform_create(self, serializer):
        todo_list = self.get_todo_list()
        if not can_manage_list(self.request.user, todo_list):
            raise PermissionDenied('Alleen de eigenaar kan taken toevoegen.')
        serializer.save(todo_list=todo_list)


# get patch en delete api todoitems id om een taak te bekijken aanpassen of verwijderen
class TodoItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoItemSerializer

    def get_queryset(self):
        user = self.request.user
        items = TodoItem.objects.select_related('todo_list', 'assigned_to')
        if user.is_admin:
            return items
        return items.filter(Q(todo_list__owner=user) | Q(assigned_to=user))

    # toegewezen gebruikers mogen hun taak aanpassen verwijderen mag alleen de eigenaar
    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method == 'DELETE' and not can_manage_list(request.user, obj.todo_list):
            raise PermissionDenied('Alleen de eigenaar kan deze taak verwijderen.')


# get api todostats geeft de tellers bovenaan de pagina omdat de lijsten per pagina komen
# kan de frontend dit niet meer zelf uitrekenen
class TodoStatsView(APIView):
    def get(self, request):
        lists = visible_lists(request.user)
        items = TodoItem.objects.filter(todo_list__in=lists)

        return Response({
            'lists': lists.count(),
            'open_tasks': items.filter(completed=False).count(),
            'assigned_to_me': items.filter(completed=False, assigned_to=request.user).count(),
        })
