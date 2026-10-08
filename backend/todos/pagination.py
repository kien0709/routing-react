from rest_framework.pagination import PageNumberPagination


# stuurt de data in stukjes zodat de frontend kan bijladen tijdens het scrollen
# https://www.django-rest-framework.org/api-guide/pagination/#pagenumberpagination
class TodoListPagination(PageNumberPagination):
    page_size = 10


class TodoItemPagination(PageNumberPagination):
    page_size = 20
