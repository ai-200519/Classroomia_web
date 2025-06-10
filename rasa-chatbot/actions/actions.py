# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import json
import requests
from datetime import datetime
import os

class ActionGetMyCourses(Action):
    def name(self) -> Text:
        return "action_get_my_courses"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        user_id = tracker.get_slot("user_id")
        if not user_id:
            dispatcher.utter_message(text="Je ne peux pas accéder à vos cours sans identification.")
            return []

        # Call your API to get user's courses
        response = requests.get(f"http://localhost:3000/api/courses/student/{user_id}")
        if response.status_code == 200:
            courses = response.json()
            if courses:
                message = "Voici vos cours :\n"
                for course in courses:
                    message += f"- {course['title']} ({course['progress']}% complété)\n"
                dispatcher.utter_message(text=message)
            else:
                dispatcher.utter_message(text="Vous n'êtes inscrit à aucun cours pour le moment.")
        else:
            dispatcher.utter_message(text="Désolé, je n'ai pas pu récupérer vos cours.")

        return []

class ActionGetCourseProgress(Action):
    def name(self) -> Text:
        return "action_get_course_progress"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        course_title = tracker.get_slot("course_title")
        user_id = tracker.get_slot("user_id")
        
        if not course_title or not user_id:
            dispatcher.utter_message(text="Je ne peux pas vérifier la progression sans le nom du cours.")
            return []

        # Call your API to get course progress
        response = requests.get(f"http://localhost:3000/api/progress/{user_id}/{course_title}")
        if response.status_code == 200:
            progress = response.json()
            dispatcher.utter_message(
                text=f"Votre progression dans le cours {course_title} est de {progress['percentage']}%.\n"
                     f"Vous avez complété {progress['completed_chapters']} sur {progress['total_chapters']} chapitres."
            )
        else:
            dispatcher.utter_message(text="Désolé, je n'ai pas pu récupérer votre progression.")

        return []

class ActionGetCourseDetails(Action):
    def name(self) -> Text:
        return "action_get_course_details"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        course_title = tracker.get_slot("course_title")
        if not course_title:
            dispatcher.utter_message(text="De quel cours souhaitez-vous connaître les détails ?")
            return []

        # Call your API to get course details
        response = requests.get(f"http://localhost:3000/api/courses/{course_title}")
        if response.status_code == 200:
            course = response.json()
            message = f"Voici les détails du cours {course['title']}:\n"
            message += f"Description: {course['description']}\n"
            message += f"Catégorie: {course['category']}\n"
            price = "Gratuit" if course['price'] == 0 else f"{course['price']}€"
            message += f"Prix: {price}\n"
            message += f"Nombre de chapitres: {course['chapter_count']}"
            dispatcher.utter_message(text=message)
        else:
            dispatcher.utter_message(text="Désolé, je n'ai pas pu récupérer les détails du cours.")

        return []

class ActionGetCreatedCourses(Action):
    def name(self) -> Text:
        return "action_get_created_courses"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        user_id = tracker.get_slot("user_id")
        if not user_id:
            dispatcher.utter_message(text="Je ne peux pas accéder à vos cours créés sans identification.")
            return []

        # Call your API to get teacher's courses
        response = requests.get(f"http://localhost:3000/api/courses/teacher/{user_id}")
        if response.status_code == 200:
            courses = response.json()
            if courses:
                message = "Voici les cours que vous avez créés :\n"
                for course in courses:
                    message += f"- {course['title']} ({course['student_count']} étudiants)\n"
                dispatcher.utter_message(text=message)
            else:
                dispatcher.utter_message(text="Vous n'avez pas encore créé de cours.")
        else:
            dispatcher.utter_message(text="Désolé, je n'ai pas pu récupérer vos cours créés.")

        return []

class ActionGetCoursePrice(Action):
    def name(self) -> Text:
        return "action_get_course_price"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        course_name = tracker.get_slot("course_name")
        if not course_name:
            dispatcher.utter_message(text="Pour quel cours souhaitez-vous connaître le prix ?")
            return []
            
        try:
            response = requests.get(
                f"{os.getenv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')}/api/courses/search",
                params={"title": course_name}
            )
            
            if response.status_code == 200:
                courses = response.json()
                if courses:
                    course = courses[0]
                    if course['price']:
                        message = f"Le cours '{course['title']}' coûte {course['price']}€."
                    else:
                        message = f"Le cours '{course['title']}' est gratuit."
                else:
                    message = f"Je n'ai pas trouvé de cours intitulé '{course_name}'."
            else:
                message = "Désolé, je n'ai pas pu récupérer le prix du cours. Veuillez réessayer plus tard."
                
        except Exception as e:
            message = "Une erreur s'est produite lors de la récupération du prix du cours."
            
        dispatcher.utter_message(text=message)
        return []

class ActionGetCourseCategories(Action):
    def name(self) -> Text:
        return "action_get_course_categories"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            response = requests.get(
                f"{os.getenv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')}/api/categories"
            )
            
            if response.status_code == 200:
                categories = response.json()
                if categories:
                    message = "Voici les catégories de cours disponibles :\n\n"
                    for category in categories:
                        message += f"- {category['name']}\n"
                else:
                    message = "Il n'y a pas encore de catégories de cours."
            else:
                message = "Désolé, je n'ai pas pu récupérer les catégories. Veuillez réessayer plus tard."
                
        except Exception as e:
            message = "Une erreur s'est produite lors de la récupération des catégories."
            
        dispatcher.utter_message(text=message)
        return []
