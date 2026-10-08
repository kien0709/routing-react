"""
wsgi instellingen voor dit project

maakt de wsgi app beschikbaar als de variabele application
wordt gebruikt om django op een webserver te draaien

meer informatie
https://docs.djangoproject.com/en/6.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
