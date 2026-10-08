from django.urls import path

from .views import UserDetailView, UserListCreateView, admin_data, current_user

urlpatterns = [
    path('auth', current_user, name='current-user'),
    path('auth/', current_user),
    path('admin-data', admin_data, name='admin-data'),
    path('admin-data/', admin_data),
    # gebruikers beheren
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
