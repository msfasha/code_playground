# **System Requirements**

This system provides a knowledge-sharing platform for university professors in Jordan. Professors can upload, manage, and share their course materials, while students can search and explore available academic content.

---

## **1. Content Upload Framework**

1.1 The system shall provide a framework that enables university professors to upload and share course-related content, including slides, documents, videos, and assessments.

1.2 Professors shall be able to upload content under **three predefined categories**, each appearing as a distinct tag associated with the course:

* **Materials** (e.g., slides, lecture notes, documents, videos)
* **Syllabus** (e.g., course outline, weekly schedule, objectives)
* **Exams & Quizzes** (e.g., past exams, sample questions, quizzes, solutions)

1.3 Professors shall be able to upload files in multiple formats, including **PDF, PPTX, DOCX, MP4**, as well as links to external content.

1.4 The system shall allow professors to upload **ZIP archives**, which the system shall extract automatically.

1.5 Extracted files shall be processed and indexed for search using the same indexing mechanism as individual uploads (later phase).

1.6 Each uploaded item shall inherit the selected category tag and be displayed accordingly under the respective category tab on the course page.

1.7 The system shall support preview generation (e.g., document thumbnails, PDF viewers, video thumbnails) where feasible.

1.8 The professor shall be able to indicate the **semester** (e.g., Fall 2024, Spring 2025) associated with each uploaded material.
1.9 Materials from different semesters shall appear grouped under the same course name, allowing students to browse course content semester by semester.
1.10 The system shall be bilingual (Arabic and English)
1.11 The system shall use simple and clean interface, mostly white background with minimal widgets and content (Google Style Content)
1.12 The landing page shall include a large seach buttong at the top (Google style), below that widgets or icons for jordanian universities logos to select course by unveristy, and below that categories card like buttons to select courses by discipline (e.g. IT, Engineering, Business, Math, Others)

---

## **2. Professor Registration & Profile Information**

2.1 Professors shall register using their institutional **.edu** email address.
2.2 Email-based verification or validation will be implemented in a later development phase.

2.3 During registration, professors may provide their university, country, and department.

2.4 These values shall be selected from predefined lookup lists.

2.5 Lookup lists (e.g., universities in Jordan, departments, countries) shall be maintained and uploaded by the system administrator.

2.6 Professors may leave the university, country, and department fields empty if they choose not to provide this information.

2.7 The system shall not restrict functionality based on whether these fields are completed.

---

## **3. Course Metadata (Professor-Provided)**

3.1 When uploading materials, professors shall be able to associate them with a set of course metadata fields.

3.2 The **course name** shall be the only mandatory metadata field required for upload.

3.3 All other metadata fields shall be optional.

3.4 Metadata values such as discipline, degree level, and university information shall be selected from predefined lookup lists maintained by the system administrator.

3.5 The system shall support the following course metadata fields:

### **Core Metadata**

* **Course Name** *(mandatory)*
* **Course Code** (e.g., CS101, EE2308)
* **Discipline / Academic Field** (lookup; e.g., Computer Science, Engineering, Business, Medicine)
* **Degree Level** (lookup; e.g., Undergraduate, Postgraduate, PhD)
* **Credit Hours** (optional numeric field)
* **Language of Instruction** (lookup; e.g., English, Arabic)

### **Additional Academic Metadata**

* **Course Description** (short text)
* **Learning Objectives / Outcomes** (optional text field)
* **Prerequisites** (lookup or free text; optional)
* **Semester Offered** (e.g., Fall, Spring, Summer)
* **Year Offered** (optional)

### **Teaching & Delivery Metadata**

* **Course Type** (lookup; e.g., Lecture, Lab, Seminar, Workshop)
* **Assessment Style** (lookup; e.g., Exam-based, Project-based, Mixed)
* **Target Audience** (lookup; e.g., Freshman, Sophomore, Graduate students)

3.6 The system shall associate uploaded materials with their metadata and include these values in search and filtering functions where applicable.

3.7 Changes to metadata shall update the indexing service to ensure accurate searchability and categorization.

---

## **4. Student Search Functionality**

4.1 Students shall be able to search for courses or uploaded materials using partial or full matches of the course name.

4.2 Search results shall include all associated files and metadata that match the query.

---

## **5. Content Indexing Service**

5.1 The application shall include a backend service (e.g., scheduled job, background thread, or crawling process) responsible for indexing uploaded materials.

5.2 The indexer shall process text-based content, extracted ZIP contents, metadata, and any other searchable properties.

5.3 The system shall utilize an appropriate search/indexing technology (e.g., Elasticsearch, Lucene, or similar).

5.4 Indexing shall run periodically or be triggered automatically when new materials are uploaded.

---

## **6. Like / Endorsement Mechanism**

6.1 Students shall be able to "like" uploaded materials.

6.2 Professors shall be able to endorse courses by other professors.

---

## **7. Search Filters**

7.1 Students shall be able to filter search results by one or more of the following criteria:

* **Country**
* **University**
* **Department**

7.2 The filter mechanism shall support combining multiple filters simultaneously.

---

## **8. Student Rating & Feedback Metrics**

8.1 Students shall be able to provide structured feedback on uploaded course materials through rating metrics.

8.2 The rating system shall allow students to evaluate materials using a set of academic and pedagogical criteria.

8.3 The system shall support the following core rating metrics:

* **Difficulty Level** (Very Easy → Very Hard)
* **Usefulness** (Not Useful → Very Useful)
* **Clarity of Presentation** (Unclear → Very Clear)
* **Content Quality** (Poor → Excellent)
* **Relevance to Course Topics** (Low Relevance → High Relevance)

8.4 The system shall compute and display aggregated scores for each metric for each uploaded material.
8.5 Students shall be allowed to update their ratings if their perception changes.
8.6 Ratings shall remain anonymous.
8.7 Professors may view aggregated feedback but shall not see individual student identities.

