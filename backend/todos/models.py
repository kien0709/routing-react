import uuid

from django.db import models

from authentication.models import FirebaseUser


# een todo lijst hoort bij 1 eigenaar
class TodoList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    owner = models.ForeignKey(FirebaseUser, on_delete=models.CASCADE, related_name='owned_lists')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.title


# een taak in een lijst kan aan een gebruiker toegewezen worden
class TodoItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    todo_list = models.ForeignKey(TodoList, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(
        FirebaseUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_items',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.title
