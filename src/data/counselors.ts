export interface Counselor {
  id: string;
  name: string;
  credentials: string;
  title: string;
  bio: string;
  specialties: string[];
  approach: string;
  education: string[];
}

export const counselors: Counselor[] = [
  {
    id: "richard-carter",
    name: "Richard Carter",
    credentials: "",
    title: "Pastoral Counselor & Life Coach",
    bio: "Richard brings 12 years of Youth Pastor experience and 5 years of private practice from Denver. He combines cognitive/behavioral methods with deep faith-based care to help people find wholeness in Christ.",
    specialties: [
      "Life transitions",
      "Faith and identity",
      "Youth and family",
      "Cognitive/behavioral approaches",
    ],
    approach: "Integrating cognitive/behavioral therapy with a Christ-centered foundation.",
    education: [
      "S. Horticultural Therapy — Kansas State University",
      "Pastoral License & Ordination — Charis Bible College",
      "A. Counseling — Liberty University",
    ],
  },
  {
    id: "clayton-howard",
    name: "Clayton Howard",
    credentials: "M.S., LMLP",
    title: "Licensed Master's Level Psychologist",
    bio: "With nearly a decade of counseling experience, Clayton brings clinical skill and genuine compassion to every session. He earned his M.S. from Fort Hays State University and is deeply committed to Christ-centered, solution-focused care.",
    specialties: [
      "Anxiety & depression",
      "Relationship dynamics",
      "Life transitions",
      "Faith struggles",
    ],
    approach: "Christ-centered, solution-focused, and reality-based therapy.",
    education: ["M.S. — Fort Hays State University"],
  },
  {
    id: "patrick-mcginnis",
    name: "Patrick McGinnis",
    credentials: "M.S., LMSW",
    title: "Licensed Master's Social Worker",
    bio: "Patrick's mission is to help people reach their God-given potential. He works primarily with young adults, couples, and families using CBT, DBT, and solution-focused approaches.",
    specialties: [
      "Young adults",
      "Couples & marriage",
      "Family systems",
      "CBT & DBT",
    ],
    approach:
      "Using CBT, DBT, and solution-focused therapy to help clients reach their God-given potential.",
    education: ["M.S. — Licensed Master's Social Work"],
  },
];
