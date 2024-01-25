from flask import Flask, jsonify, request
from flask_cors import CORS
from joblib import load
import requests
import json

presence_classifier = load('presence_classifier.joblib')
presence_vect = load('presence_vectorizer.joblib')
category_classifier = load('category_classifier.joblib')
category_vect = load('category_vectorizer.joblib')

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def main():
    if request.method == 'POST':
        output = []
        data = request.get_json().get('tokens') 
        data = [item for item in data if item]
        print(data)
        payload = {
            "text_list": data
        }
        payload = json.dumps(payload)
        url = "https://2d40-203-110-242-42.ngrok-free.app/"
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        print("\n\n\n\n")
    #    https://2d40-203-110-242-42.ngrok-free.app/ 
        # for token in data:
        #     result = presence_classifier.predict(presence_vect.transform([token]))
        #     if result == 'Dark':
        #         cat = category_classifier.predict(category_vect.transform([token]))
        #         output.append(cat[0])
        #     else:
        #         output.append(result[0])

        # dark = [data[i] for i in range(len(output)) if output[i] == 'Dark']
        # for d in dark:
        #     print(d)
        # print()
        # print(len(dark))

        # message = '{ \'result\': ' + str(output) + ' }'
        # print(message)
        message = {
            "result": response.json()["processed_strings"]
        }
        resp = json.dumps(message)
        print(resp)
        return resp

if __name__ == '__main__':
    app.run(threaded=True, debug=True)
