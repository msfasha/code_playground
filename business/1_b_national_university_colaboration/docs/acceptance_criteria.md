Below is a full set of **User Stories with Acceptance Criteria**, aligned exactly with the reorganized system requirements. They are grouped by functional area and written in standard Agile format:

**As a <user>, I want <goal> so that <benefit>.**

Acceptance criteria follow the **Given / When / Then** structure.

---

# **User Stories & Acceptance Criteria**

---

# **1. Content Upload Framework**

### **US 1.1 – Upload Course Materials**

**As a professor**, I want to upload course materials in different formats so that I can share content with students and other professors.

**Acceptance Criteria**

* **Given** I am logged in as a professor
  **When** I upload a file in PDF, PPTX, DOCX, or MP4 format
  **Then** the system shall save it successfully and associate it with the selected course.

---

### **US 1.2 – Upload ZIP Archives**

**As a professor**, I want to upload ZIP files so that the system can extract and process multiple documents at once.

**Acceptance Criteria**

* **Given** I upload a ZIP file
  **When** the upload is completed
  **Then** the system extracts the ZIP content and indexes all valid files.

---

### **US 1.3 – Select Content Category**

**As a professor**, I want to assign a category (Materials / Syllabus / Exams & Quizzes) to each upload so that users can easily browse content.

**Acceptance Criteria**

* **Given** I am uploading a file
  **When** I choose one of the three content categories
  **Then** the file appears under the correct tab inside the course page.

---

### **US 1.4 – Assign Semester to Material**

**As a professor**, I want to specify the semester for each uploaded material so that students can view semester-specific content.

**Acceptance Criteria**

* **Given** I upload material and select a semester
  **When** I save the upload
  **Then** the material appears grouped under that semester within the course page.

---

# **2. Professor Registration & Profile Information**

### **US 2.1 – Register with .edu Email**

**As a professor**, I want to register using an institutional .edu email so that the system can verify my academic affiliation.

**Acceptance Criteria**

* **Given** I enter a .edu email
  **When** I attempt to register
  **Then** the system accepts my email and creates my account.

---

### **US 2.2 – Select Profile Information**

**As a professor**, I want to select my university, department, and country from lookup lists so that my profile is standardized.

**Acceptance Criteria**

* **Given** I am registering
  **When** I view the profile fields
  **Then** I can select values from predefined lists or leave them empty.

---

# **3. Course Metadata**

### **US 3.1 – Enter Course Metadata**

**As a professor**, I want to provide detailed course metadata so that students can understand the course context.

**Acceptance Criteria**

* **Given** I am uploading or editing course information
  **When** I enter optional metadata fields
  **Then** the system saves them and associates them with the course.

---

### **US 3.2 – Mandatory Course Name**

**As a professor**, I want the system to require only the course name so that I can upload materials quickly.

**Acceptance Criteria**

* **Given** I am creating a new course
  **When** I do not provide any metadata except the course name
  **Then** the system allows me to proceed.

---

# **4. Student Search Functionality**

### **US 4.1 – Search by Keyword**

**As a student**, I want to search for materials using partial or full course names so I can quickly find relevant content.

**Acceptance Criteria**

* **Given** I enter a keyword
  **When** I perform a search
  **Then** courses and materials matching the keyword appear.

---

# **5. Content Indexing Service**

### **US 5.1 – Indexed Content**

**As a student**, I want search results to appear instantly so that I can find materials efficiently.

**Acceptance Criteria**

* **Given** materials are uploaded
  **When** the indexing service runs
  **Then** those materials become searchable.

---

# **6. Like / Endorsement Mechanism**

### **US 6.1 – Students Like Materials**

**As a student**, I want to like materials so that I can signal their usefulness.

**Acceptance Criteria**

* **Given** I am logged in as a student
  **When** I click “Like”
  **Then** the student-like counter for that material increases.

---

### **US 6.2 – Professors Endorse Materials**

**As a professor**, I want to endorse materials so I can recommend content to others.

**Acceptance Criteria**

* **Given** I am logged in as a professor
  **When** I click “Endorse”
  **Then** the professor endorsement counter increases.

---

# **7. Search Filters**

### **US 7.1 – Filter Search Results**

**As a student**, I want to filter materials by country, university, or department so that search results are more relevant.

**Acceptance Criteria**

* **Given** filters are available
  **When** I apply one or more filters
  **Then** the search results update to show only matching entries.

---

# **8. Student Rating & Feedback Metrics**

### **US 8.1 – Rate Material**

**As a student**, I want to rate materials on multiple metrics so that others understand their quality.

**Acceptance Criteria**

* **Given** I access a material
  **When** I submit ratings for difficulty, clarity, usefulness, etc.
  **Then** the system stores my ratings and updates the aggregated score.

---

### **US 8.2 – Update Rating**

**As a student**, I want to update my ratings so they reflect my latest perception.

**Acceptance Criteria**

* **Given** I previously rated the material
  **When** I submit new ratings
  **Then** the old ratings are replaced with the new ones.

---

### **US 8.3 – Anonymous Ratings**

**As a student**, I want my ratings to be anonymous so that I can give honest feedback.

**Acceptance Criteria**

* **Given** ratings are submitted
  **When** professors view feedback
  **Then** they only see aggregated results without identifying students.

---

