from django.core.management.base import BaseCommand, CommandError

from authentication.models import FirebaseUser


class Command(BaseCommand):
    help = 'Set the local authorization role for a Firebase user.'

    def add_arguments(self, parser):
        parser.add_argument('firebase_uid')
        parser.add_argument('role', choices=FirebaseUser.Role.values)
        parser.add_argument('--email', default='')

    def handle(self, *args, **options):
        uid = options['firebase_uid'].strip()

        if not uid:
            raise CommandError('firebase_uid cannot be empty')

        user, created = FirebaseUser.objects.get_or_create(
            firebase_uid=uid,
            defaults={'email': options['email']},
        )
        user.role = options['role']

        if options['email']:
            user.email = options['email']

        user.save()
        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{action} {uid} as {user.role}.'))
