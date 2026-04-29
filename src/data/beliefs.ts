export interface Belief {
  id: string;
  title: string;
  body: string;
  icon?: string;
}

export const beliefs: Belief[] = [
  {
    id: "god",
    title: "God",
    body: "We believe in one eternal, all-knowing, all-powerful, and all-wise God. He is unchanging in His nature, perfect in all His ways, and exists as three distinct persons — Father, Son, and Holy Spirit — united in one divine being.",
  },
  {
    id: "jesus",
    title: "Jesus Christ",
    body: "We believe Jesus Christ is both fully God and fully man. He lived a sinless life, gave Himself as a substitutionary sacrifice for our sins, and rose bodily from the dead on the third day. He ascended to the Father and will return again in glory.",
  },
  {
    id: "holy-spirit",
    title: "Holy Spirit",
    body: "We believe the Holy Spirit glorifies Christ, convicts the world of sin, righteousness, and judgment, indwells every believer at the moment of salvation, and distributes spiritual gifts for the building up of the church.",
  },
  {
    id: "bible",
    title: "The Bible",
    body: "We believe the Bible is God-breathed and was inspired by the Holy Spirit. It is authoritative, trustworthy, and without error in its original writings — our complete guide for faith and practice.",
  },
  {
    id: "humanity",
    title: "Human Beings",
    body: "We believe human beings were created in the image of God, male and female, with dignity and eternal worth. Through Adam's fall, sin entered the human race, and every person is sinful by both nature and choice.",
  },
  {
    id: "salvation",
    title: "Salvation",
    body: "We believe salvation is entirely by God's grace, received through faith alone in the atoning blood of Jesus Christ. God Himself secures and maintains the salvation of every true believer.",
  },
  {
    id: "eternity",
    title: "Eternity",
    body: "We believe heaven and hell are real, eternal destinations. Eternal life with God is the certain hope of every believer. Eternal separation from God awaits those who reject Jesus Christ.",
  },
  {
    id: "church",
    title: "The Church",
    body: "We believe the Church is the Bride of Christ — genuine followers of Jesus across all ages and cultures. The Church worships God and ministers to the spiritual, emotional, and physical needs of the community.",
  },
  {
    id: "marriage",
    title: "Marriage",
    body: "We believe marriage is a sacred covenant between one man and one woman, intended to be lifelong, with Jesus Christ as the foundation of that union.",
  },
  {
    id: "baptism",
    title: "Baptism",
    body: "We believe in believer's baptism by immersion — a public declaration of faith that symbolizes the believer's union with Christ in His death, burial, and resurrection.",
  },
  {
    id: "communion",
    title: "Communion",
    body: "We observe communion with crackers and juice as symbols of Christ's body and blood given for us. This ordinance is for genuine followers of Jesus and is a time of remembrance and renewal.",
  },
];
