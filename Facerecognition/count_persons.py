"""
Person Counter — Field of Vision
=================================
Opens the webcam and counts ONLY the number of persons visible in the frame.
Uses OpenCV's built-in HOG (Histogram of Oriented Gradients) pedestrian detector,
which is trained exclusively on the human body silhouette.

Usage:
    python count_persons.py              # default webcam
    python count_persons.py --source 1   # alternate camera index
    python count_persons.py --source video.mp4  # video file

Controls:
    Q  — quit
    S  — save a screenshot to the current directory
"""

import cv2
import argparse
import time
import os
from datetime import datetime


# ── Configuration ──────────────────────────────────────────────────────────
CONFIDENCE_THRESHOLD = 0.35   # reject weak detections (lower = more sensitive)
NMS_THRESHOLD        = 0.45   # non-max suppression overlap (higher = fewer duplicates)
SCALE_FACTOR         = 1.03   # detection window scale step
WIN_STRIDE           = (4, 4) # sliding window step size (smaller = slower but more accurate)
PADDING              = (8, 8) # padding around detection window


def build_detector():
    """Initialise the HOG + Linear SVM person detector shipped with OpenCV."""
    hog = cv2.HOGDescriptor()
    hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
    return hog


def detect_persons(hog, frame):
    """
    Run pedestrian detection and return filtered bounding boxes + weights.
    Returns:
        boxes   — list of (x, y, w, h)
        weights — list of float confidence scores
    """
    # Detect people — returns (rects, weights)
    rects, weights = hog.detectMultiScale(
        frame,
        winStride=WIN_STRIDE,
        padding=PADDING,
        scale=SCALE_FACTOR,
    )

    if len(rects) == 0:
        return [], []

    # Filter by confidence
    filtered_boxes = []
    filtered_weights = []
    for (x, y, w, h), weight in zip(rects, weights):
        if weight > CONFIDENCE_THRESHOLD:
            filtered_boxes.append((x, y, w, h))
            filtered_weights.append(float(weight))

    # Apply non-maximum suppression to remove overlapping detections
    if len(filtered_boxes) > 0:
        boxes_for_nms = [[x, y, x + w, y + h] for (x, y, w, h) in filtered_boxes]
        indices = cv2.dnn.NMSBoxes(
            boxes_for_nms,
            filtered_weights,
            CONFIDENCE_THRESHOLD,
            NMS_THRESHOLD,
        )

        if len(indices) > 0:
            indices = indices.flatten()
            final_boxes = [filtered_boxes[i] for i in indices]
            final_weights = [filtered_weights[i] for i in indices]
            return final_boxes, final_weights

    return [], []


def draw_results(frame, boxes, weights, person_count, fps):
    """
    Draw bounding boxes, labels, and the live person count on the frame.
    """
    overlay = frame.copy()

    # Draw each detected person
    for idx, ((x, y, w, h), weight) in enumerate(zip(boxes, weights), start=1):
        # Green bounding box
        cv2.rectangle(overlay, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Label background
        label = f"Person #{idx}  {weight:.0%}"
        (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 1)
        cv2.rectangle(overlay, (x, y - th - 10), (x + tw + 6, y), (0, 255, 0), cv2.FILLED)
        cv2.putText(overlay, label, (x + 3, y - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 0, 0), 1, cv2.LINE_AA)

    # ── Head-Up Display (top bar) ──────────────────────────────────────────
    bar_h = 50
    cv2.rectangle(overlay, (0, 0), (frame.shape[1], bar_h), (20, 20, 20), cv2.FILLED)

    # Person count (left)
    count_text = f"Persons Detected: {person_count}"
    cv2.putText(overlay, count_text, (12, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 0.85, (0, 255, 120), 2, cv2.LINE_AA)

    # FPS (right)
    fps_text = f"FPS: {fps:.1f}"
    (fw, _), _ = cv2.getTextSize(fps_text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 1)
    cv2.putText(overlay, fps_text, (frame.shape[1] - fw - 12, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1, cv2.LINE_AA)

    # Blend overlay for slight transparency on boxes
    cv2.addWeighted(overlay, 0.85, frame, 0.15, 0, frame)
    return frame


def main():
    parser = argparse.ArgumentParser(description="Person Counter — Field of Vision")
    parser.add_argument("--source", default="0",
                        help="Camera index (0, 1, …) or path to a video file")
    args = parser.parse_args()

    # Determine source
    source = int(args.source) if args.source.isdigit() else args.source
    cap = cv2.VideoCapture(source)

    if not cap.isOpened():
        print(f"[ERROR] Cannot open video source: {args.source}")
        return

    hog = build_detector()
    prev_time = time.time()
    fps = 0.0
    screenshot_dir = os.path.dirname(os.path.abspath(__file__))

    print("=" * 55)
    print("   PERSON COUNTER — FIELD OF VISION")
    print("=" * 55)
    print(f"Source : {args.source}")
    print("Press Q to quit  |  Press S to save a screenshot")
    print("=" * 55)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[INFO] End of video stream.")
            break

        # Mirror for webcam
        if isinstance(source, int):
            frame = cv2.flip(frame, 1)

        # Detect
        boxes, weights = detect_persons(hog, frame)
        person_count = len(boxes)

        # FPS calculation
        curr_time = time.time()
        fps = 1.0 / max(curr_time - prev_time, 1e-6)
        prev_time = curr_time

        # Draw
        frame = draw_results(frame, boxes, weights, person_count, fps)

        # Show
        cv2.imshow("Person Counter — Field of Vision", frame)

        # Keyboard
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == ord('Q'):
            break
        elif key == ord('s') or key == ord('S'):
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            path = os.path.join(screenshot_dir, f"person_count_{ts}.png")
            cv2.imwrite(path, frame)
            print(f"[SCREENSHOT] Saved → {path}")

    cap.release()
    cv2.destroyAllWindows()
    print("[INFO] Person counter stopped.")


if __name__ == "__main__":
    main()
