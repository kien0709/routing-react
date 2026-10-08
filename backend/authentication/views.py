from django.http import JsonResponse
from django.views.decorators.http import require_GET
from firebase_admin import auth as firebase_auth
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .firebase import initialize_firebase
from .firebase_auth import IsAdmin, admin_required, firebase_authenticated
from .models import FirebaseUser
from .serializers import UserOptionSerializer, UserSerializer


# zet de ingelogde gebruiker om naar json voor de frontend
def serialize_user(user):
    return {
        'id': user.id,
        'uid': user.firebase_uid,
        'email': user.email or None,
        'name': user.display_name or None,
        'photoUrl': user.photo_url or None,
        'emailVerified': user.email_verified,
        'role': user.role,
        'isAdmin': user.is_admin,
    }


# get api auth geeft de ingelogde gebruiker terug
@require_GET
@firebase_authenticated
def current_user(request):
    return JsonResponse(serialize_user(request.firebase_user))


@require_GET
@admin_required
def admin_data(request):
    return JsonResponse(
        {
            'message': 'This data is only available to admins.',
            'data': {
                'totalUsers': FirebaseUser.objects.count(),
                'adminUsers': FirebaseUser.objects.filter(
                    role=FirebaseUser.Role.ADMIN,
                ).count(),
            },
        }
    )


# get api users geeft de lijst van gebruikers en post maakt een nieuwe gebruiker alleen admin
class UserListCreateView(generics.ListCreateAPIView):
    queryset = FirebaseUser.objects.order_by('display_name', 'email')

    # iedereen mag de lijst zien voor het toewijzen van taken alleen admins mogen aanmaken
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    # admins zien alle velden gewone gebruikers alleen naam en email
    def get_serializer_class(self):
        if getattr(self.request.user, 'is_admin', False):
            return UserSerializer
        return UserOptionSerializer


# get patch en delete api users id om een gebruiker te bekijken aanpassen of verwijderen alleen admin
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FirebaseUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    # verwijdert het account uit firebase en uit de database maar niet je eigen account
    def perform_destroy(self, instance):
        if instance == self.request.user:
            raise PermissionDenied('Je kunt je eigen account niet verwijderen.')

        initialize_firebase()
        try:
            firebase_auth.delete_user(instance.firebase_uid)
        except firebase_auth.UserNotFoundError:
            pass

        instance.delete()
