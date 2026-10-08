from django.db import models


class FirebaseUser(models.Model):
    class Role(models.TextChoices):
        USER = 'user', 'User'
        ADMIN = 'admin', 'Admin'

    firebase_uid = models.CharField(max_length=128, unique=True)
    email = models.EmailField(blank=True)
    display_name = models.CharField(max_length=255, blank=True)
    photo_url = models.URLField(blank=True)
    email_verified = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email or self.firebase_uid

    # nodig voor de isauthenticated permission van drf
    @property
    def is_authenticated(self):
        return True

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN
