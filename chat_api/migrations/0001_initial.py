# Generated by Django 3.2.4 on 2022-05-27 20:24

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_name', models.CharField(max_length=20, unique=True)),
                ('code', models.CharField(max_length=6, unique=True)),
                ('is_active', models.BooleanField(default=False)),
                ('owner', models.ManyToManyField(null=True, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=1000)),
                ('val1', models.CharField(max_length=1000)),
                ('val2', models.CharField(max_length=1000)),
                ('val3', models.CharField(max_length=1000)),
                ('date', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('room', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='chat_api.room')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Active',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active_users', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('room', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='chat_api.room')),
            ],
        ),
    ]
