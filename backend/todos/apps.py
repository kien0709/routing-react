from django.apps import AppConfig


# registreert de todos app bij django
class TodosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'todos'
