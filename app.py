from flask import Flask, render_template, request, redirect, url_for, Response
import mysql.connector
import cv2
from PIL import Image
import numpy as np
import os

app = Flask(__name__)

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="",
    database="truattend_db"
)
mycursor = mydb.cursor()


# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Generating the dataset >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
def generate_dataset(nbr):
    """This function is used to capture the face of the person and store it in the dataset folder.
    The argument nbr is the label or ID of the person whose face is being captured."""
    face_classifier = cv2.CascadeClassifier(
        r"C:\Users\a\PycharmProjects\FlaskOpencv_FaceRecognition\resources\haarcascade_frontalface_default.xml")

    def face_cropped(img):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray, 1.3, 5)
        # scaling factor=1.3
        # Minimum neighbor = 5

        if faces == ():
            return None
        for (x, y, w, h) in faces:
            cropped_face = img[y:y + h, x:x + w]
        return cropped_face

    cap = cv2.VideoCapture(0)

    mycursor.execute("select ifnull(max(img_id), 0) from imgs_dataset")
    row = mycursor.fetchone()
    lastid = row[0]

    img_id = lastid
    max_imgid = img_id + 100
    count_img = 0

    while True:
        ret, img = cap.read()
        if face_cropped(img) is not None:
            count_img += 1
            img_id += 1
            face = cv2.resize(face_cropped(img), (200, 200))
            face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            #saving images to the dataset folder
            file_name_path = "dataset/" + nbr + "." + str(img_id) + ".jpg"
            cv2.imwrite(file_name_path, face)
            cv2.putText(face, str(count_img), (50, 50), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)
            #adding images to the database
            mycursor.execute("""INSERT INTO `imgs_dataset` (`img_id`, `img_person`) VALUES
                                ('{}', '{}')""".format(img_id, nbr))
            mydb.commit()

            frame = cv2.imencode('.jpg', face)[1].tobytes()
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            if cv2.waitKey(1) == 13 or int(img_id) == int(max_imgid):
                break
                cap.release()
                cv2.destroyAllWindows()


# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Training the Classifier >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
@app.route('/train_classifier/<nbr>')
def train_classifier(nbr):
    "This function is used to train the face recognition classifier using the images in the dataset folder."
    dataset_dir = r"C:\Users\a\PycharmProjects\FlaskOpencv_FaceRecognition\dataset"

    path = [os.path.join(dataset_dir, f) for f in os.listdir(dataset_dir)]
    faces = []
    ids = []

    for image in path:
        img = Image.open(image).convert('L');
        imageNp = np.array(img, 'uint8')
        id = int(os.path.split(image)[1].split(".")[1])

        faces.append(imageNp)
        ids.append(id)
    ids = np.array(ids)

    # Train the classifier and save
    clf = cv2.face.LBPHFaceRecognizer_create()
    clf.train(faces, ids)
    clf.write("classifier.xml")

    return redirect('/')


# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Face Recognition >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
def face_recognition():  # generate frame by frame from camera
    "This function uses the OpenCV library to capture video from the default camera and performs face recognition on each frame."
    def draw_boundary(img, classifier, scaleFactor, minNeighbors, color, text, clf):
        """This function takes an image, a pre-trained classifier, a scale factor, a minimum number of neighbors, a color, a text, and a face recognition classifier as parameters.
         function uses classifier to detect faces in the image and draws a rectangle around each detected face with its identity."""
        gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        features = classifier.detectMultiScale(gray_image, scaleFactor, minNeighbors)

        coords = []

        for (x, y, w, h) in features:
            cv2.rectangle(img, (x, y), (x + w, y + h), color, 2)
            id, pred = clf.predict(gray_image[y:y + h, x:x + w])
            confidence = int(100 * (1 - pred / 300))

            mycursor.execute("select P.std_name "
                             "  from imgs_dataset I "
                             "  left join participants P on I.img_person = P.std_id "
                             " where img_id = " + str(id))
            s = mycursor.fetchone()
            # s = '' + ''.join(s)
            s = s or ''
            s = '' + ''.join(list(s))

            if confidence > 70:
                cv2.putText(img, s, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 1, cv2.LINE_AA)
            else:
                cv2.putText(img, "UNKNOWN", (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 1, cv2.LINE_AA)

            coords = [x, y, w, h]
        return coords


    def recognize(img, clf, faceCascade):
        """This function takes an image, a face recognition classifier, and a pre-trained Haar Cascade classifier.
        This function is to detect and recognize faces in the frame using a pre-trained Haar Cascade classifier."""
        coords = draw_boundary(img, faceCascade, 1.1, 10, (255, 255, 0), "Face", clf)
        return img

    faceCascade = cv2.CascadeClassifier(
        r"C:\Users\a\PycharmProjects\FlaskOpencv_FaceRecognition\resources\haarcascade_frontalface_default.xml")
    clf = cv2.face.LBPHFaceRecognizer_create()
    clf.read("classifier.xml")

    wCam, hCam = 500, 400

    cap = cv2.VideoCapture(0)
    cap.set(3, wCam)
    cap.set(4, hCam)

    while True:
        ret, img = cap.read()
        img = recognize(img, clf, faceCascade)

        frame = cv2.imencode('.jpg', img)[1].tobytes()
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        key = cv2.waitKey(1)
        if key == 27:
            break


@app.route('/')
def home():
    "This function retrieves data from the database and renders the index.html template with the retrieved data."
    mycursor.execute("select std_id, std_name, std_course, std_active, std_added from participants")
    data = mycursor.fetchall()

    return render_template('index.html', data=data)


@app.route('/addprsn')
def addprsn():
    "This function retrieves the maximum ID from the database, increments it by 1, and renders the addprsn.html template with the incremented ID."
    mycursor.execute("select ifnull(max(std_id) + 1, 101) from participants")
    row = mycursor.fetchone()
    nbr = row[0]
    # print(int(nbr))

    return render_template('addprsn.html', newnbr=int(nbr))


@app.route('/addprsn_submit', methods=['POST'])
def addprsn_submit():
    "This function receives form data submitted via the addprsn.html form, inserts the data into the database, and redirects to the vfdataset_page page."
    stdid = request.form.get('txtnbr')
    stdname = request.form.get('txtname')
    stdcourse = request.form.get('optskill')

    mycursor.execute("""INSERT INTO `participants` (`std_id`, `std_name`, `std_course`) VALUES
                    ('{}', '{}', '{}')""".format(stdid, stdname, stdcourse))
    mydb.commit()

    # return redirect(url_for('home'))
    return redirect(url_for('vfdataset_page', prs=stdid))


@app.route('/vfdataset_page/<prs>')
def vfdataset_page(prs):
    "function renders the gendataset.html template with the ID of the person whose dataset is being generated."
    return render_template('gendataset.html', prs=prs)


@app.route('/delete_row', methods=['POST'])
def delete_row():
    student_id = request.form.get('student_id')

    mycursor.execute("""DELETE FROM imgs_dataset WHERE img_person="""+student_id,)
    mycursor.execute("""DELETE FROM participants WHERE std_id="""+student_id)

    mydb.commit()

    return 'Success'  # Return a success message to the client


@app.route('/vidfeed_dataset/<nbr>')
def vidfeed_dataset(nbr):
    "This function is used to stream video from the default camera and capture images for the dataset generation process."
    # Video streaming route. Put this in the src attribute of an img tag
    return Response(generate_dataset(nbr), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/video_feed')
def video_feed():
    "function streams video from the default camera and performs real-time face recognition on each frame."
    # Video streaming route. Put this in the src attribute of an img tag
    return Response(face_recognition(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/fr_page')
def fr_page():
    "This function renders the fr_page.html template."
    return render_template('fr_page.html')


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)