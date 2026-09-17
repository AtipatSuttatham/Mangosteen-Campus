from django.db import models


class TimeStampedModel(models.Model):
    """Abstract mixin: created_at/updated_at ให้ model หลักทุกตัว inherit (docs/database.md §1)"""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
