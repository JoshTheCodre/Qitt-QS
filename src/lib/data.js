/**
 * Application Data
 * Centralized data store for forms and dropdowns
 */

// Nigerian Universities
export const universities = [
    { value: 'uniport', label: 'University of Port Harcourt (UNIPORT)' },
    { value: 'ust', label: 'Rivers State University (RSU/UST)' },
    { value: 'captain-elechi', label: 'Captain Elechi Amadi Polytechnic' },
    { value: 'ignatius-ajuru', label: 'Ignatius Ajuru University of Education' },
    { value: 'ken-saro-wiwa', label: 'Ken Saro-Wiwa Polytechnic' },
    { value: 'unilag', label: 'University of Lagos (UNILAG)' },
    { value: 'unn', label: 'University of Nigeria, Nsukka (UNN)' },
    { value: 'ui', label: 'University of Ibadan (UI)' },
    { value: 'abu', label: 'Ahmadu Bello University (ABU)' },
    { value: 'uniben', label: 'University of Benin (UNIBEN)' },
    { value: 'unilorin', label: 'University of Ilorin (UNILORIN)' },
    { value: 'oau', label: 'Obafemi Awolowo University (OAU)' },
    { value: 'futa', label: 'Federal University of Technology, Akure (FUTA)' },
    { value: 'covenant', label: 'Covenant University' },
    { value: 'babcock', label: 'Babcock University' },
]

// Academic Departments
export const departments = [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'software-engineering', label: 'Software Engineering' },
    { value: 'information-technology', label: 'Information Technology' },
    { value: 'electrical-engineering', label: 'Electrical Engineering' },
    { value: 'mechanical-engineering', label: 'Mechanical Engineering' },
    { value: 'civil-engineering', label: 'Civil Engineering' },
    { value: 'chemical-engineering', label: 'Chemical Engineering' },
    { value: 'petroleum-engineering', label: 'Petroleum Engineering' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'biochemistry', label: 'Biochemistry' },
    { value: 'microbiology', label: 'Microbiology' },
    { value: 'accounting', label: 'Accounting' },
    { value: 'economics', label: 'Economics' },
    { value: 'business-administration', label: 'Business Administration' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'law', label: 'Law' },
    { value: 'medicine', label: 'Medicine & Surgery' },
    { value: 'nursing', label: 'Nursing' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'mass-communication', label: 'Mass Communication' },
    { value: 'english', label: 'English Language' },
    { value: 'political-science', label: 'Political Science' },
]

// Academic Levels
export const levels = [
    { value: '100', label: '100 Level' },
    { value: '200', label: '200 Level' },
    { value: '300', label: '300 Level' },
    { value: '400', label: '400 Level' },
    { value: '500', label: '500 Level' },
    { value: 'postgraduate', label: 'Postgraduate' },
]

// Material Types
export const materialTypes = [
    { value: 'lecture-note', label: 'Lecture Note' },
    { value: 'study-material', label: 'Study Material' },
    { value: 'past-question', label: 'Past Question' },
]

// Phone Number Prefixes (Nigerian Networks)
export const phoneNetworks = [
    { value: '0803', label: 'MTN (0803)' },
    { value: '0806', label: 'MTN (0806)' },
    { value: '0810', label: 'MTN (0810)' },
    { value: '0813', label: 'MTN (0813)' },
    { value: '0814', label: 'MTN (0814)' },
    { value: '0816', label: 'MTN (0816)' },
    { value: '0903', label: 'MTN (0903)' },
    { value: '0906', label: 'MTN (0906)' },
    { value: '0805', label: 'Glo (0805)' },
    { value: '0807', label: 'Glo (0807)' },
    { value: '0811', label: 'Glo (0811)' },
    { value: '0815', label: 'Glo (0815)' },
    { value: '0905', label: 'Glo (0905)' },
    { value: '0802', label: 'Airtel (0802)' },
    { value: '0808', label: 'Airtel (0808)' },
    { value: '0812', label: 'Airtel (0812)' },
    { value: '0901', label: 'Airtel (0901)' },
    { value: '0809', label: '9mobile (0809)' },
    { value: '0817', label: '9mobile (0817)' },
    { value: '0818', label: '9mobile (0818)' },
    { value: '0908', label: '9mobile (0908)' },
]

// User Roles (for future use)
export const userRoles = [
    { value: 'student', label: 'Student' },
    { value: 'admin', label: 'Administrator' },
    { value: 'moderator', label: 'Moderator' },
]

// Gender Options
export const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Prefer not to say' },
]

// Academic Sessions (Nigerian format)
export const academicSessions = [
    { value: '2024-2025', label: '2024/2025' },
    { value: '2023-2024', label: '2023/2024' },
    { value: '2022-2023', label: '2022/2023' },
    { value: '2021-2022', label: '2021/2022' },
    { value: '2020-2021', label: '2020/2021' },
]

// Semesters
export const semesters = [
    { value: 'first', label: 'First Semester' },
    { value: 'second', label: 'Second Semester' },
]

// Quick Actions
export const quickActions = [
  {
    id: 'install',
    icon: 'Download',
    title: 'Install Qitt',
    description: 'Access Materials offline',
    cardBgColor: 'bg-purple-50',
    iconBgColor: 'bg-purple-300',
    iconColor: 'text-purple-700',
    link: 'install',
  },
  {
    id: 'support',
    icon: 'FaWhatsapp',
    title: 'Need Support?',
    description: 'Contact Us On Whatsapp',
    cardBgColor: 'bg-green-50',
    iconBgColor: 'bg-green-300',
    iconColor: 'text-green-700',
    link: 'whatsapp', // Special handler in QuickActions
  },
  {
    id: 'profile',
    icon: 'FaUser',
    title: 'Complete Profile',
    description: 'Unlock More Features',
    cardBgColor: 'bg-blue-50',
    iconBgColor: 'bg-blue-300',
    iconColor: 'text-blue-700',
    link: 'profile',  // Special handler for profile card
  },
  {
    id: 'share',
    icon: 'Share2',
    title: 'Share',
    description: 'Earn Points By Sharing Qitt',
    cardBgColor: 'bg-yellow-50',
    iconBgColor: 'bg-yellow-300',
    iconColor: 'text-yellow-700',
    link: '/share',
  },
]// Sample Continue Reading Data (would come from API/database)
export const continueReadingData = [
    {
        id: '1',
        code: 'CSC 301',
        title: 'Data Structures & Algorithms',
        subtitle: 'Comprehensive Notes On Sorting Algorithms',
        progress: 55,
        progressColor: 'bg-blue-600',
        lastRead: '12mins ago',
    },
    {
        id: '2',
        code: 'ENG 201',
        title: 'Engineering Mathematics II',
        subtitle: 'Differential Equations and Linear Algebra',
        progress: 78,
        progressColor: 'bg-yellow-500',
        lastRead: '1 hour ago',
    },
    {
        id: '3',
        code: 'PHY 202',
        title: 'Modern Physics',
        subtitle: 'Quantum Mechanics and Relativity',
        progress: 34,
        progressColor: 'bg-green-600',
        lastRead: '2 days ago',
    },
]

// Sample Suggested Materials Data (would come from API/database)
export const suggestedMaterialsData = [
    {
        id: '1',
        code: 'CSC 302',
        title: 'Operating Systems',
        subtitle: 'Process Management and Scheduling',
        isPremium: true,
        fileType: 'PDF',
    },
    {
        id: '2',
        code: 'MTH 201',
        title: 'Linear Algebra',
        subtitle: 'Vector Spaces and Matrix Operations',
        isPremium: false,
        fileType: 'DOCX',
    },
    {
        id: '3',
        code: 'CSC 305',
        title: 'Computer Networks',
        subtitle: 'TCP/IP Protocol Suite and Network Security',
        isPremium: true,
        fileType: 'PDF'
    },
    //   },
    //   {
    //     id: '4',
    //     code: 'ENG 301',
    //     title: 'Control Systems',
    //     subtitle: 'Feedback Systems and Stability Analysis',
    //     isPremium: false,
    //     fileType: 'PDF',
    //   },
    //   {
    //     id: '5',
    //     code: 'CSC 401',
    //     title: 'Artificial Intelligence',
    //     subtitle: 'Machine Learning and Neural Networks',
    //     isPremium: true,
    //     fileType: 'PDF',
    //   },
    //   {
    //     id: '6',
    //     code: 'CHM 201',
    //     title: 'Organic Chemistry',
    //     subtitle: 'Reaction Mechanisms and Synthesis',
    //     isPremium: false,
    //     fileType: 'DOCX',
    //   },
]

// Helper function to get label by value
export const getLabelByValue = (data, value) => {
    const item = data.find(item => item.value === value)
    return item ? item.label : value
}


const Departments = {
    "Faculties": {
      "Humanities": [
        "English Studies",
        "Foreign Languages and Literatures",
        "History and Diplomatic Studies",
        "Linguistics and Communication Studies",
        "Philosophy",
        "Religious and Cultural Studies",
        "Theatre and Film Studies"
      ],
      "Social Sciences": [
        "Economics",
        "Geography and Environmental Management",
        "Political and Administrative Studies",
        "Sociology",
        "Social Work"
      ],
      "Management Sciences": [
        "Accounting",
        "Finance and Banking",
        "Management",
        "Marketing",
        "Hospitality Management and Tourism"
      ],
      "Education": [
        "Adult and Non-Formal Education",
        "Educational Foundations",
        "Educational Management",
        "Educational Psychology, Guidance and Counselling",
        "Human Kinetics and Health Education",
        "Library and Information Science",
        "Early Childhood and Primary Education"
      ],
      "Science": [
        "Animal and Environmental Biology",
        "Biochemistry",
        "Chemistry",
        "Geology",
        "Mathematics and Statistics",
        "Microbiology",
        "Physics",
        "Plant Science and Biotechnology",
        "Pure and Industrial Chemistry"
      ],
      "Engineering": [
        "Chemical Engineering",
        "Civil Engineering",
        "Electrical/Electronic Engineering",
        "Environmental Engineering",
        "Mechanical Engineering",
        "Petroleum Engineering",
        "Gas Engineering"
      ],
      "College of Health Sciences": [
        "Medicine and Surgery",
        "Nursing Science",
        "Human Anatomy",
        "Human Physiology",
        "Dentistry",
        "Pharmacology",
        "Medical Laboratory Science"
      ],
      "Pharmaceutical Sciences": [
        "Pharmacy"
      ],
      "Agriculture": [
        "Agricultural Economics and Extension",
        "Animal Science",
        "Crop and Soil Science",
        "Fisheries",
        "Forestry and Wildlife Management"
      ],
      "Law": [
        "Law"
      ],
      "Environmental Sciences": [
        "Architecture",
        "Quantity Surveying",
        "Estate Management",
        "Urban and Regional Planning"
      ],
      "Computing": [
        "Computer Science",
        "Cyber Security",
        "Information Technology"
      ]
    }
  };
  
  export default Departments;
