from django.contrib import admin

from .models import FirebaseUser


@admin.register(FirebaseUser)
class FirebaseUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'firebase_uid', 'role', 'email_verified', 'updated_at')
    list_filter = ('role', 'email_verified')
    search_fields = ('email', 'firebase_uid', 'display_name')
