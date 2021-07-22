import numpy as np
import argparse, sys, cv2

from math import pow, sqrt
from skimage import io

class FaceDetect():
    """docstring for ."""

    def __init__(self, session):
        # Parse the arguments from command line
        # arg = argparse.ArgumentParser(description='Social distance detection')

        self.args = {
            'session' : session,
            'model' : "home\SSD_MobileNet.caffemodel",
            'prototxt' : "home\SSD_MobileNet_prototxt.txt",
            'labels' : "home\class_labels.txt",
            'confidence' : 0.2
        }

        self.labels = [line.strip() for line in open(self.args['labels'])]

        # Generate random bounding box bounding_box_color for each label
        self.bounding_box_color = np.random.uniform(0, 255, size=(len(self.labels), 3))


        # Load model
        print("\nLoading model...\n")
        self.network = cv2.dnn.readNetFromCaffe(self.args["prototxt"], self.args["model"])

        print("\nStreaming video using device...\n")

        self.frame_no = 0
        self.frame = io.imread(f"data/{self.args['session'].session_key}-clientImage.png")
        # print(self.frame.shape)
        if self.frame.shape[2] == 4:
            self.frame = cv2.cvtColor(self.frame, cv2.COLOR_BGRA2BGR)

    def get_frame(self):

        self.frame_no = self.frame_no+1

        # Capture one frame after another
        try:
            frame = io.imread(f"data/{self.args['session'].session_key}-clientImage.png")
        except:
            return True
        # print(self.frame.shape)
        if frame.shape[2] == 4:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)
        # print(frame.shape)
        (h, w) = frame.shape[:2]

        # Resize the frame to suite the model requirements. Resize the frame to 300X300 pixels
        blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 0.007843, (300, 300), 127.5)

        self.network.setInput(blob)
        detections = self.network.forward()

        pos_dict = dict()
        coordinates = dict()

        # Focal length
        F = 562
        FW = 790
        for i in range(detections.shape[2]):

            confidence = detections[0, 0, i, 2]

            if confidence > self.args["confidence"]:

                class_id = int(detections[0, 0, i, 1])

                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype('int')

                # Filtering only persons detected in the frame. Class Id of 'person' is 15
                #cv2.rectangle(frame, (startX, startY), (endX, endY), bounding_box_color[class_id], 2)
                if class_id == 15.00:

                    # Draw bounding box for the object
                    cv2.rectangle(frame, (startX, startY), (endX, endY), self.bounding_box_color[class_id], 2)

                    label = "{}: {:.2f}%".format(self.labels[class_id], confidence * 100)
                    #print("{}".format(label))


                    coordinates[i] = (startX, startY, endX, endY)

                    # Mid point of bounding box
                    x_mid = round((startX+endX)/2,4)
                    y_mid = round((startY+endY)/2,4)

                    height = round(endY-startY,4)
                    width = round(endX-startX,4)

                    # Distance from camera based on triangle similarity
                    distanceW = (165 * F)/height
                    #print("Distance(cm):{dist}\n".format(dist=distance))
                    distance = (41 * FW)/width

                    # Mid-point of bounding boxes (in cm) based on triangle similarity technique
                    x_mid_cm = (x_mid * distance) / F
                    y_mid_cm = (y_mid * distance) / F
                    pos_dict[i] = (x_mid_cm,y_mid_cm,distance,distanceW)

        # Distance between every object detected in a frame
        close_objects = set()
        status = 'Green'
        for i in pos_dict.keys():
            for j in pos_dict.keys():
                if i < j:
                    dist = sqrt(pow(pos_dict[i][0]-pos_dict[j][0],2) + pow(pos_dict[i][1]-pos_dict[j][1],2) + pow(pos_dict[i][2]-pos_dict[j][2],2))
                    #cv2.line(frame, (coordinates[i][0],coordinates[i][1]),(coordinates[j][0],coordinates[j][1]),(0,0,255),2)
                    # Check if distance less than 2 metres or 200 centimetres
                    if dist < 200:
                        cv2.line(frame, (coordinates[i][0],coordinates[i][1]),(coordinates[j][0],coordinates[j][1]),(0,0,255),2)
                        close_objects.add(i)
                        close_objects.add(j)
                        status = 'Red'
                for k in pos_dict.keys():
                    if k in close_objects:

                        COLOR = (0,0,255)
                    else:
                        COLOR = (0,255,0)
                    (startX, startY, endX, endY) = coordinates[k]

                    cv2.rectangle(frame, (startX, startY), (endX, endY), COLOR, 2)
                    y = startY - 15 if startY - 15 > 15 else startY + 15
                    # Convert cms to feet
                    cv2.putText(frame, 'Depth: {i} cm'.format(i=round(pos_dict[k][2],4)), (startX, y),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLOR, 2)
                    #print(f"Distance : W = {distanceW} , H = {distance}  ,PH = {height}, PW = {width}")

        ret, jpeg = cv2.imencode('.png', frame)
        return jpeg
    #     cv2.namedWindow('Frame',cv2.WINDOW_NORMAL)
    #
    #     # Show frame
    #     cv2.imshow('Frame', frame)
    #     cv2.resizeWindow('Frame',800,600)
    #
    #     key = cv2.waitKey(1) & 0xFF
    #
    #     # Press `q` to exit
    #     if key == ord("q"):
    #         break
    #
    # # Clean
    # cap.release()
    # cv2.destroyAllWindows()
