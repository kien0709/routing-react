"""
asgi instellingen voor dit project

maakt de asgi app beschikbaar als de variabele application
wordt gebruikt om django op een async webserver te draaien

meer informatie
https://docs.djangoproject.com/en/6.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_asgi_application()
