"""
url instellingen voor dit project

de lijst urlpatterns koppelt urls aan views meer informatie
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
voorbeelden
functie views
    1 importeer de view  from my_app import views
    2 voeg een url toe aan urlpatterns  path('', views.home, name='home')
class based views
    1 importeer de view  from other_app.views import Home
    2 voeg een url toe aan urlpatterns  path('', Home.as_view(), name='home')
urls van een andere app toevoegen
    1 importeer include  from django.urls import include, path
    2 voeg een url toe aan urlpatterns  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls')),
    path('api/', include('todos.urls')),
]
