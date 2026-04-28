from django.db import models

class Case(models.Model):
  title = models.CharField(max_length=255)
  company_name = models.CharField(max_length=255)
  description = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.title

class Note(models.Model):
  CLASSIFICATION_CHOICES = [
    ('risk', 'Risk'),
    ('opportunity', 'Opportunity'),
    ('neutral', 'Neutral'),
  ]

  case = models.ForeignKey(Case, related_name='notes', on_delete=models.CASCADE)
  content = models.TextField()
  classification = models.CharField(max_length=20, choices=CLASSIFICATION_CHOICES, default='neutral')
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"Note for {self.case.title} - {self.classification}"