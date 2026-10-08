import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials

SECRETS_DIR = Path(__file__).resolve().parent.parent / 'secrets'


def get_credentials_path():
    env_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    if env_path:
        return env_path

    json_files = sorted(SECRETS_DIR.glob('*.json'))
    if not json_files:
        raise RuntimeError(
            f'Geen Firebase service account gevonden in {SECRETS_DIR}. '
            'Zet het .json bestand daar neer of zet GOOGLE_APPLICATION_CREDENTIALS.'
        )
    return str(json_files[0])


def initialize_firebase():
    try:
        return firebase_admin.get_app()
    except ValueError:
        cred = credentials.Certificate(get_credentials_path())
        return firebase_admin.initialize_app(cred)
