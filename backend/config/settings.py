"""
django instellingen voor dit project

gemaakt met django admin startproject versie 6.1.1

meer informatie over dit bestand
https://docs.djangoproject.com/en/6.1/topics/settings/

alle instellingen en hun waarden
https://docs.djangoproject.com/en/6.1/ref/settings/
"""

from pathlib import Path

# paden binnen het project maak je met base dir en de naam van de map
BASE_DIR = Path(__file__).resolve().parent.parent


# instellingen om snel te ontwikkelen niet geschikt voor productie
# https://docs.djangoproject.com/en/6.1/howto/deployment/checklist/

# beveiliging houd de secret key in productie geheim
SECRET_KEY = 'django-insecure-_8pll3d*s^5m-j9k88h#k8d)ofg_nj8xdfu+7n!j==lfot2gjq'

# beveiliging zet debug nooit aan in productie
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']


# apps die dit project gebruikt

INSTALLED_APPS = [
    'corsheaders',
    'rest_framework',
    'authentication',
    'todos',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# database
# https://docs.djangoproject.com/en/6.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        # wachten op een lock in plaats van meteen database is locked
        'OPTIONS': {'timeout': 20},
    }
}


# wachtwoord controles voor de eigen accounts van django
# https://docs.djangoproject.com/en/6.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# taal en tijdzone
# https://docs.djangoproject.com/en/6.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# statische bestanden zoals css javascript en afbeeldingen
# https://docs.djangoproject.com/en/6.1/howto/static-files/

STATIC_URL = 'static/'

# https://www.django-rest-framework.org/api-guide/settings/
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'authentication.firebase_auth.FirebaseAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'UNAUTHENTICATED_USER': None,
}

CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
]


# email
# https://docs.djangoproject.com/en/6.1/topics/email/#topic-email-configuration

MAILERS = {
    'default': {
        'BACKEND': 'django.core.mail.backends.console.EmailBackend',
    },
}
