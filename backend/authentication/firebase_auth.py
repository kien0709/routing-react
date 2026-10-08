from functools import wraps

from django.http import JsonResponse
from firebase_admin import auth
from rest_framework import authentication, permissions
from rest_framework.exceptions import AuthenticationFailed

from .firebase import initialize_firebase
from .models import FirebaseUser


# eigen fout voor als het firebase token niet klopt
class FirebaseTokenError(Exception):
    pass


# haalt het token uit de authorization header die begint met bearer
def get_token(request):

    header = request.headers.get('Authorization', '')

    if not header.startswith('Bearer '):
        return None

    return header.removeprefix('Bearer ').strip() or None


# controleert het token bij firebase en geeft de gebruiker uit de database terug
def get_user_from_token(id_token):
    initialize_firebase()

    # token controleren
    # https://firebase.google.com/docs/auth/admin/manage-sessions#detect_id_token_revocation
    try:
        decoded_token = auth.verify_id_token(id_token, check_revoked=True)
    except auth.RevokedIdTokenError:
        raise FirebaseTokenError('Token is ingetrokken.')
    except auth.UserDisabledError:
        raise FirebaseTokenError('Account is uitgeschakeld.')
    except auth.InvalidIdTokenError:
        raise FirebaseTokenError('Token is ongeldig of verlopen.')

    values = {
        'email': decoded_token.get('email', ''),
        'photo_url': decoded_token.get('picture', ''),
        'email_verified': decoded_token.get('email_verified', False),
    }

    # gebruiker opslaan in database
    user, created = FirebaseUser.objects.get_or_create(
        firebase_uid=decoded_token['uid'],
        defaults={**values, 'display_name': decoded_token.get('name', '')},
    )
    if created:
        return user

    # alleen schrijven als er echt iets veranderd is sqlite kan maar 1 schrijver tegelijk
    # aan en de frontend stuurt meerdere requests tegelijk
    changed = [field for field, value in values.items() if getattr(user, field) != value]

    # naam alleen invullen als hij nog leeg is zodat een admin hem kan aanpassen
    if not user.display_name and decoded_token.get('name'):
        values['display_name'] = decoded_token['name']
        changed.append('display_name')

    if changed:
        for field in changed:
            setattr(user, field, values[field])
        user.save(update_fields=changed)

    return user


# https://docs.python.org/3/library/functools.html#functools.wraps
def firebase_authenticated(view):
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        id_token = get_token(request)
        if id_token is None:
            return JsonResponse({'detail': 'Geen token meegestuurd.'}, status=401)

        try:
            request.firebase_user = get_user_from_token(id_token)
        except FirebaseTokenError as error:
            return JsonResponse({'detail': str(error)}, status=401)

        return view(request, *args, **kwargs)

    return wrapper


def admin_required(view):
    # eerst inloggen controleren daarna of de gebruiker admin is
    @firebase_authenticated
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        if not request.firebase_user.is_admin:
            return JsonResponse({'detail': 'Alleen voor admins.'}, status=403)

        return view(request, *args, **kwargs)

    return wrapper


# zelfde controle voor django rest framework views
# https://www.django-rest-framework.org/api-guide/authentication/#custom-authentication
class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        id_token = get_token(request)
        if id_token is None:
            return None

        try:
            return (get_user_from_token(id_token), None)
        except FirebaseTokenError as error:
            raise AuthenticationFailed(str(error))

    def authenticate_header(self, request):
        # zorgt voor 401 in plaats van 403 zodat de frontend het token kan verversen
        return 'Bearer'


# drf permission alleen admins mogen door
class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)
