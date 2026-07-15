export interface Belief {
  id: string;
  title: string;
  /** One or more verbatim paragraphs from the celebratejesus.org Statement of Faith. */
  paragraphs: string[];
}

/**
 * "The Essentials We Believe" — the full Statement of Faith, VERBATIM from
 * celebratejesus.org / c3hays.com (About → The Essentials We Believe).
 * Section order and wording mirror the live site exactly; nothing paraphrased.
 */
export const beliefs: Belief[] = [
  {
    id: "god",
    title: "About God",
    paragraphs: [
      "We believe in one true and eternal God, unchanging, unchangeable.",
      "The God who is described in the Bible is unique; He is unlike anyone or anything else in all the universe. God has all power, all knowledge, all wisdom, and is due all glory, honor, and praise.",
      "We believe the Bible teaches that there is but one being of God, yet there are three Persons who share this one being: the Father, the Son, and the Holy Spirit. Each Person is fully and completely God; each is described in Scripture as possessing the attributes of God. The Father, Son, and Holy Spirit have eternally existed in the relationship described by the term “Trinity.”",
    ],
  },
  {
    id: "father",
    title: "About the Father",
    paragraphs: [
      "We believe in God the Father, the first Person of the Trinity, the sovereign ruler and creator of heaven and earth. He is intimately involved in the affairs of men.",
      "He hears and answers prayers as well as saving those who come to Him by faith in Jesus Christ.",
    ],
  },
  {
    id: "jesus",
    title: "About Jesus Christ",
    paragraphs: [
      "We believe the Son, Jesus Christ, is God incarnate.",
      "He was fully God and fully man, was conceived by the Holy Spirit, born of a virgin, lived a sinless life, and offered himself as a substitutionary sacrifice for sinners. By the blood of his cross he satisfied the wrath we deserved, obtaining for us eternal redemption, the forgiveness of sins, spiritual adoption as sons and daughters, life everlasting, and defeated the powers of darkness. He was raised bodily on the third day and ascended to the right hand of the Father, there to make intercession for the redeemed.",
    ],
  },
  {
    id: "holy-spirit",
    title: "About the Holy Spirit",
    paragraphs: [
      "We believe the Holy Spirit is fully God, equal with the Father and Son. The primary ministry of the Holy Spirit is to glorify the Lord Jesus Christ. The Holy Spirit convicts unbelievers of their need for Christ and imparts spiritual life through regeneration (being born again). The Holy Spirit indwells every believer, at the moment of salvation and gives spiritual gifts as He wills. In addition, He sanctifies, leads, illumines, and graciously empowers for godly living and service all who come to faith in Christ.",
    ],
  },
  {
    id: "bible",
    title: "About the Bible",
    paragraphs: [
      "We believe the Bible to be revelation from God written by human authors under the supernatural guidance of the Holy Spirit.",
      "The Scriptures of both the Old and New Testaments are inspired, without error in the original writings, and are complete in all respects. We believe the Scriptures to be “God-breathed” and therefore fully authoritative in and of themselves; they rely for their authority upon no church, council, or creed, but are authoritative simply because they are the Word of God. The Scriptures are the complete and sufficient revelation of his will for salvation and the final authority for all Christian faith and life.",
      "We take Biblical truth very seriously.",
      "Although there may be multiple applications of a given scriptural passage, there can only be one proper interpretation. Therefore, it is vital we study the grammatical and historical context of each passage to first understand what the author intended to convey to his audience before making application to our circumstances. In today’s world we are inundated with video clips, social media posts, and so many teachings that call themselves “Christian;” thus, we understand that this is a difficult time to determine what is true. This struggle points us all the more to the crucial importance of every Christian taking what they hear and read back to God’s Word.",
    ],
  },
  {
    id: "humanity",
    title: "About Human Beings",
    paragraphs: [
      "We believe human beings were directly handmade by God, created by design male and female, and created in His image and likeness. Therefore, man stands unique among the created order to have the potential and capacity to know their creator. Adam and Eve were created free of sin, possessed intelligence, choice, and moral responsibility to glorify God. Their willful sin resulted in immediate spiritual death and eventual physical death. They incurred the righteous wrath of God which is not malicious but is His rightful response to evil and unrighteousness. It seems quite possible, based on God’s response to their sin, that while disciplining Adam and Eve, He extended grace and forgiveness. However, because of their sin, all of creation is fallen along with man and Adam’s fallen state has been transmitted to all men. All men, therefore, are sinners both by nature and choice.",
      "We believe pain and suffering are a result of living in this fallen world and are part of the human experience. We reject teaching that implies Christians should always be healthy, wealthy, and problem-free. The Bible is replete with accounts of righteous people who experienced tragedy, sickness, and death. Although Christians are not promised pain-free lives, we are assured God will walk with us through life’s difficulties. As our submission to and trust in His will grows, even during the most tumultuous of times, we can experience His peace which surpasses all human understanding.",
    ],
  },
  {
    id: "salvation",
    title: "About Salvation",
    paragraphs: [
      "We believe that, due to universal death through sin, no one can enter the kingdom of God unless born again.",
      "The Holy Spirit regenerates our hearts, raising us to spiritual life while creating new desires to love and serve God rather than loving and serving ourselves and sin.",
      "Salvation is God’s free gift to any who receives it by grace alone through faith alone in the shed blood of Jesus Christ alone. All who receive Jesus Christ as Lord are declared righteous by God and become His children. Salvation is secured and maintained by God’s grace and power not by any human effort or merit.",
    ],
  },
  {
    id: "eternity",
    title: "About Eternity",
    paragraphs: [
      "We believe that heaven and hell are real places of eternal existence.",
      "We believe that when Christians die, their souls pass immediately into heaven, there to enjoy conscious fellowship with the Savior until the day of the resurrection and glorious transformation of the body. The saved will then forever dwell in blissful fellowship with their great Triune God. We also believe that when those who rejected Jesus Christ die, their souls are consigned to hell, there to await the day of judgment when they shall be punished with eternal separation from the presence of God.",
    ],
  },
  {
    id: "second-coming",
    title: "Second Coming",
    paragraphs: [
      "We believe that the Kingdom of God came in the ministry of the Lord Jesus Christ, that it continues to expand by the ministry of the Holy Spirit through the Church, and that it will be consummated in the glorious, visible, and triumphant appearing of Christ when he returns to the earth as King. We believe that after Christ returns, he will bring about the ultimate defeat of Satan, the resurrection of the dead, the final judgment of the living and the dead, and the eternal blessing of the righteous. At that time, the Kingdom of God will be completely fulfilled in the new heavens and the new earth, in which righteousness dwells and in which he will be worshiped forever.",
    ],
  },
  {
    id: "church",
    title: "The Church",
    paragraphs: [
      "We believe the Church is the Bride of Christ and is comprised of genuine followers of Christ in every age. The Church is also God’s primary instrument through which he is fulfilling his redemptive purposes in the earth. We believe the Church exists to worship and glorify God, to preach the gospel to all nations, and to display God’s love by ministering to the needs of those in our community and beyond. We also affirm the priesthood of all believers and the importance of every Christian being joined with and actively involved in a local community of the saints.",
    ],
  },
  {
    id: "marriage",
    title: "About Marriage",
    paragraphs: [
      "We believe God created marriage to be between a man and a woman, to be a life-long commitment, and that the foundation of marriage is Christ; designed to be a reflection of His love.",
    ],
  },
  {
    id: "ordinances",
    title: "Ordinances",
    paragraphs: [
      "We believe there are two ordinances (rites or sacraments) of the Church ordained by Jesus Christ, which are not means of salvation but do convey sanctifying grace and blessings to the faithful.",
    ],
  },
  {
    id: "baptism",
    title: "Baptism",
    paragraphs: [
      "We believe water baptism is only intended for those who have received the saving benefits of Christ through the new birth of the Holy Spirit (being born again). In obedience to Christ’s command and as a testimony to God, the Church, oneself and the world, believers are baptized by immersion in the name of the Father, Son, and Holy Spirit. Water baptism is a visual and symbolic demonstration of a person’s union with Christ in the likeness of His death and resurrection. It signifies that a former way of life has been put to death and vividly depicts the release from bondage of sin and death.",
    ],
  },
  {
    id: "communion",
    title: "Communion",
    paragraphs: [
      "We believe the Lord’s Supper is to be observed only by those who have become genuine followers of Christ. At C3, crackers and juice symbolize Christ’s body broken and His blood shed on our behalf.",
      "Communion is to be observed repeatedly throughout the Christian life as a sign of continued participation in the atoning benefits of Christ’s death. As we come to the table with an attitude of faith and self-examination, we remember and proclaim the death of Christ, receive spiritual nourishment for our souls, and signify our unity with other members of Christ’s body until he returns.",
    ],
  },
];
