import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
  url: 'dev.db'
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  await prisma.userProgress.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.amendment.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.learningLesson.deleteMany({});
  await prisma.promptConfig.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding countries...');

  // 1. India
  const india = await prisma.country.create({
    data: {
      name: 'India',
      code: 'IN',
      flagUrl: '🇮🇳',
      overview: 'Adopted in 1950, the Constitution of India is the longest written constitution of any sovereign country in the world. It provides a comprehensive framework guiding the governance of the nation, balancing federalism with a strong central bias.',
      governmentStructure: 'India is a Federal Parliamentary Democratic Republic. Power is shared between the central Union government and the States. The President is the formal Head of State, while the Prime Minister leads the executive cabinet and holds real administrative power. The legislature is bicameral: the Lok Sabha (House of the People) and the Rajya Sabha (Council of States).',
      fundamentalRights: 'Part III of the Indian Constitution lists six core Fundamental Rights guaranteed to all citizens: the Right to Equality, the Right to Freedom (including speech, assembly, and movement), the Right against Exploitation, the Right to Freedom of Religion, Cultural and Educational Rights, and the Right to Constitutional Remedies (which allows citizens to approach the Supreme Court directly if their rights are violated).',
      history: 'The Constitution was drafted by a Constituent Assembly, which met over a period of nearly three years. Dr. B.R. Ambedkar was the Chairman of the Drafting Committee. It was formally adopted on November 26, 1949, and went into effect on January 26, 1950, celebrating India’s transition into a sovereign republic.',
    },
  });

  // 2. United States
  const usa = await prisma.country.create({
    data: {
      name: 'United States',
      code: 'US',
      flagUrl: '🇺🇸',
      overview: 'Ratified in 1788 and effective in 1789, the United States Constitution is the oldest written constitution still in active force today. It outlines a federal system, defines the structure of the national government, and establishes a system of checks and balances.',
      governmentStructure: 'The United States is a Constitutional Federal Republic. It features a strict separation of powers divided among three distinct branches: Legislative (a bicameral Congress: Senate and House of Representatives), Executive (headed by the President, who serves as both Head of State and Head of Government), and Judicial (led by the Supreme Court). Power is shared between the national government and individual states.',
      fundamentalRights: 'Fundamental rights are primarily codified in the Bill of Rights—the first ten amendments to the Constitution. These include freedom of speech, religion, the press, and peaceful assembly (First Amendment); the right to bear arms (Second Amendment); protection against unreasonable search and seizure (Fourth Amendment); due process rights (Fifth Amendment); and protection against cruel and unusual punishment (Eighth Amendment).',
      history: 'Following the American Revolution and the weak initial Articles of Confederation, delegates met in Philadelphia in 1787 for the Constitutional Convention. Designed to build a stronger national government while preserving state autonomy, it was ratified by the states and took effect in 1789.',
    },
  });

  // 3. United Kingdom
  const uk = await prisma.country.create({
    data: {
      name: 'United Kingdom',
      code: 'UK',
      flagUrl: '🇬🇧',
      overview: 'Unlike most other countries, the United Kingdom does not have a single written constitutional document. Instead, its constitution is "uncodified," consisting of historical statutes, common law judgements, treaties, and constitutional conventions.',
      governmentStructure: 'The United Kingdom is a Parliamentary Constitutional Monarchy with devolved administrations. The King or Queen serves as a ceremonial Head of State, while political executive power resides in the Prime Minister and Cabinet, who are drawn from Parliament. The Westminster Parliament is bicameral: the elected House of Commons and the appointed House of Lords. Regional parliaments are located in Scotland, Wales, and Northern Ireland.',
      fundamentalRights: 'Fundamental rights are protected through historical documents like Magna Carta (1215) and the Bill of Rights (1689), alongside common law traditions and modern legislation such as the Human Rights Act 1998, which incorporated the European Convention on Human Rights into domestic UK law.',
      history: 'The UK constitution has developed organically over more than 800 years. Key milestones include Magna Carta in 1215 (limiting the power of the King), the Bill of Rights 1689 (establishing parliamentary sovereignty), the Acts of Union, and the European Communities Act 1972, followed by Devolution Acts in 1998.',
    },
  });

  // 4. France
  const france = await prisma.country.create({
    data: {
      name: 'France',
      code: 'FR',
      flagUrl: '🇫🇷',
      overview: 'The Constitution of the French Fifth Republic was adopted in 1958. It was designed by Charles de Gaulle and Michel Debré to replace the weak parliamentary regime of the Fourth Republic with a stronger executive branch.',
      governmentStructure: 'France is a Semi-Presidential Republic. Executive power is split between the President (directly elected for a five-year term, acting as Head of State, directing foreign policy and defense) and the Prime Minister (appointed by the President, acting as Head of Government, leading domestic administration). Parliament is bicameral: the National Assembly and the Senate.',
      fundamentalRights: 'Constitutional rights are guaranteed via the Preamble of the 1958 Constitution, which incorporates three major texts: the 1789 Declaration of the Rights of Man and of the Citizen (freedom, property, safety, and resistance to oppression), the Preamble to the 1946 Constitution (socio-economic rights like equality for women and right to health), and the 2004 Charter for the Environment.',
      history: 'Following political instability and the Algerian crisis, General Charles de Gaulle was invited to draft a new constitution. Ratified by a massive referendum in September 1958, it established the Fifth Republic, which remains France’s governing framework today.',
    },
  });

  // 5. Japan
  const japan = await prisma.country.create({
    data: {
      name: 'Japan',
      code: 'JP',
      flagUrl: '🇯🇵',
      overview: 'Enacted in 1947, the Constitution of Japan (often called the Post-War or Peace Constitution) establishes a parliamentary government and guarantees fundamental human rights. It is famous for its Article 9, which renounces war.',
      governmentStructure: 'Japan is a Parliamentary Constitutional Monarchy. The Emperor is defined as "the symbol of the State and of the unity of the people," holding no political power. Legislative power is held by the National Diet (bicameral: House of Representatives and House of Councillors). Executive power is exercised by the Prime Minister and the Cabinet, who must hold the confidence of the Diet.',
      fundamentalRights: 'Chapter III of the Constitution outlines "Rights and Duties of the People." It includes guarantees of equality under the law, freedom of speech and assembly, academic freedom, freedom of choice of occupation, and the right to "maintain the minimum standards of wholesome and cultured living" (Article 25).',
      history: 'Following its defeat in World War II, Japan was occupied by Allied forces. A new constitution was drafted under the supervision of General Douglas MacArthur’s headquarters, focusing on democracy, human rights, and pacifism. It replaced the 1889 imperial Meiji Constitution and went into force on May 3, 1947.',
    },
  });

  console.log('Seeding articles...');

  // Articles list
  const articlesData = [
    // India Articles
    {
      countryId: india.id,
      articleNumber: 'Article 14',
      title: 'Equality Before Law',
      originalText: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
      simplifiedExplanation: 'This article ensures that everyone is equal in the eyes of the law. The government cannot treat people differently based on arbitrary factors like their religion, race, caste, sex, or place of birth. Laws apply to everyone equally, and the government must protect everyone equally.',
      childFriendlyExplanation: 'Imagine playing a game where the rules are exactly the same for every single player, and the referee has to treat everyone fairly no matter who they are. That is what Article 14 does for all people in India!',
      realLifeExample: 'If a rich business owner and a poor street vendor commit the same traffic violation, the traffic police must issue the exact same fine to both. The law cannot give special treatment to the wealthy person or extra punishment to the poor person.',
      keyTakeaways: 'Everyone is equal in the eyes of the law.\nNo discrimination based on birth, gender, or status.\nEqual protection of laws for all citizens and foreigners.',
      topic: 'Fundamental Rights',
    },
    {
      countryId: india.id,
      articleNumber: 'Article 19(1)(a)',
      title: 'Freedom of Speech and Expression',
      originalText: 'All citizens shall have the right to freedom of speech and expression.',
      simplifiedExplanation: 'Citizens have the right to express their views, opinions, and beliefs freely through speech, writing, printing, pictures, or any other medium. However, this is not absolute; the government can impose reasonable limits to protect national security, public order, decency, or relations with other countries.',
      childFriendlyExplanation: 'You have the right to share your thoughts, write stories, draw pictures, and speak up about what you believe is right, as long as you do not hurt others, lie about them, or cause danger.',
      realLifeExample: 'A citizen writes an article in a newspaper criticizing the economic policies of the government. Under Article 19(1)(a), the government cannot arrest them for voicing their peaceful political opinions.',
      keyTakeaways: 'Right to express thoughts, ideas, and opinions freely.\nIncludes writing, art, press, and speech.\nSubject to "reasonable restrictions" for safety and public decency.',
      topic: 'Freedom of Speech',
    },
    {
      countryId: india.id,
      articleNumber: 'Article 21',
      title: 'Protection of Life and Personal Liberty',
      originalText: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
      simplifiedExplanation: 'This article protects the right to live and be free. The state cannot arrest you, lock you up, or take your life without a clear, fair legal trial and a valid law. The Supreme Court has expanded this to include the right to clean water, air, privacy, and free education.',
      childFriendlyExplanation: 'Nobody is allowed to take away your freedom, lock you up in jail, or hurt you unless they follow strict, fair court rules. You also have the right to a healthy, safe life with food, school, and clean air.',
      realLifeExample: 'If the police lock someone in jail without telling them why and without bringing them before a judge within 24 hours, they are violating the person’s Article 21 rights.',
      keyTakeaways: 'Protects the absolute right to life and freedom.\nNo arrest without proper legal procedure.\nIncludes right to privacy, clean environment, and free primary education.',
      topic: 'Fundamental Rights',
    },

    // USA Articles
    {
      countryId: usa.id,
      articleNumber: 'First Amendment',
      title: 'Freedom of Religion, Speech, Press, and Assembly',
      originalText: 'Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.',
      simplifiedExplanation: 'This amendment guarantees five core freedoms: freedom of religion (the government cannot choose a national religion or stop you from practicing your faith), freedom of speech, freedom of the press (newspapers/media can report news), freedom to gather peacefully, and freedom to ask the government to fix problems.',
      childFriendlyExplanation: 'You can choose your own religion (or none), speak your mind, print the truth, gather in groups for peaceful meetings, and write letters to the President telling them what needs to be fixed. The government cannot stop you!',
      realLifeExample: 'A group of citizens holds a peaceful march on a city sidewalk holding signs that protest a new tax law. Under the First Amendment, the city police cannot arrest them just for expressing their disagreement.',
      keyTakeaways: 'Separation of church and state (no state religion).\nRight to speak and write opinions without government censorship.\nRight to assemble peacefully and protest.',
      topic: 'Freedom of Speech',
    },
    {
      countryId: usa.id,
      articleNumber: 'Article I, Section 1',
      title: 'Legislative Power and Congress',
      originalText: 'All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.',
      simplifiedExplanation: 'This section says that only Congress has the power to make federal laws for the United States. Congress is split into two groups: the Senate (representing states equally) and the House of Representatives (representing states based on population). The President cannot write laws alone.',
      childFriendlyExplanation: 'Only the members of Congress, who are elected by the citizens, are allowed to make the rules and laws for the country. The laws are decided by two groups: the Senate and the House.',
      realLifeExample: 'If the President wants to spend money on building a new highway system, they cannot just write an order. They must ask Congress to pass a law approving the money, because only Congress controls the budget and lawmaking.',
      keyTakeaways: 'Congress is the sole federal lawmaking body.\nBicameral structure: Senate and House of Representatives.\nPart of the separation of powers (checks and balances).',
      topic: 'Government Structure',
    },
    {
      countryId: usa.id,
      articleNumber: 'Fifth Amendment',
      title: 'Rights of the Accused and Due Process',
      originalText: 'No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury... nor shall any person be subject for the same offence to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law...',
      simplifiedExplanation: 'The Fifth Amendment protects people accused of crimes. It guarantees that: you can\'t be tried twice for the exact same crime (double jeopardy); you cannot be forced to speak against yourself (the right to remain silent); and the government cannot take your life, freedom, or property without a fair legal process.',
      childFriendlyExplanation: 'If you are suspected of doing something wrong, you do not have to talk to the police if it will get you into trouble (you can "plead the fifth"). Also, the government has to be fair and follow all the court rules before they can punish you.',
      realLifeExample: 'During a trial, a defendant refuses to answer a prosecutor’s question on the witness stand because the answer could make them look guilty. This is a valid exercise of their Fifth Amendment rights.',
      keyTakeaways: 'Right to remain silent (no self-incrimination).\nProtection against double jeopardy (cannot be tried twice for the same act).\nGuarantee of fair legal procedures (due process).',
      topic: 'Judicial Review',
    },

    // UK Articles (Statutes / Documents)
    {
      countryId: uk.id,
      articleNumber: 'Magna Carta (Clause 39)',
      title: 'Right to Due Process and Law of the Land',
      originalText: 'No free man shall be seized or imprisoned, or stripped of his rights or possessions, or outlawed or exiled, or deprived of his standing in any way, nor will we proceed with force against him, or send others to do so, except by the lawful judgement of his equals or by the law of the land.',
      simplifiedExplanation: 'Written in 1215, this clause is the foundation of modern justice. It says the King or government cannot lock up citizens, take their property, or banish them just because they want to. The government must follow established laws and give people a trial by jury.',
      childFriendlyExplanation: 'Over 800 years ago, a king was told that he could not put people in jail or take their toys away just because he was angry. He had to follow the law and let a jury decide. This became the basis of fairness for the whole world!',
      realLifeExample: 'If a state official wants to seize a house because the owner spoke out against the King, the official cannot do so without bringing the owner to a court and winning a legal judgement.',
      keyTakeaways: 'Established that the King/Executive is not above the law.\nFirst written guarantee of trial by jury.\nOrigin of the concept of due process.',
      topic: 'Judicial Review',
    },
    {
      countryId: uk.id,
      articleNumber: 'Bill of Rights 1689 (Article 9)',
      title: 'Freedom of Speech in Parliament',
      originalText: 'That the freedom of speech and debates or proceedings in Parliament ought not to be impeached or questioned in any court or place out of Parliament.',
      simplifiedExplanation: 'This clause guarantees "Parliamentary Privilege." It means members of Parliament (MPs) can speak, debate, and reveal information inside the parliament building without any fear of being sued or arrested by courts or the King. This ensures representatives can discuss sensitive topics freely.',
      childFriendlyExplanation: 'People who represent you in Parliament can talk about anything, ask hard questions, and tell the truth without getting in trouble or being sued in court. This helps them stand up for you!',
      realLifeExample: 'An MP reveals in the House of Commons that a major company is polluting a river, bypassing a court injunction that prevents newspapers from printing the company\'s name. The MP cannot be sued for slander or contempt of court.',
      keyTakeaways: 'Protects the independence of parliamentarians.\nEnsures free debates on national issues.\nCourts cannot prosecute MPs for statements made in Parliament.',
      topic: 'Freedom of Speech',
    },

    // France Articles
    {
      countryId: france.id,
      articleNumber: 'Article 1',
      title: 'The Indivisible, Secular, Democratic, and Social Republic',
      originalText: 'France shall be an indivisible, secular, democratic and social Republic. It shall ensure the equality of all citizens before the law, without distinction of origin, race or religion. It shall respect all beliefs. It shall be organised on a decentralised basis.',
      simplifiedExplanation: 'This article outlines French national identity. "Indivisible" means France is one country with one set of laws. "Secular" (Laïcité) means church and state are separate; the state is neutral toward religion. "Democratic" means the people vote for their leaders. "Social" means the state provides welfare support (healthcare, pensions) to citizens.',
      childFriendlyExplanation: 'France is a country where everyone must follow the same rules, the government does not take sides on religion, citizens vote to choose leaders, and the state helps take care of people who are sick, old, or poor.',
      realLifeExample: 'The government cannot fund or build a Catholic church or a Muslim mosque using public tax money, because the government must remain secular and neutral to all religions.',
      keyTakeaways: 'State and religion are strictly separate (Laïcité).\nEquality before the law regardless of race or religion.\nCommitment to a social welfare safety net.',
      topic: 'Government Structure',
    },
    {
      countryId: france.id,
      articleNumber: 'Declaration of Rights 1789 (Article 11)',
      title: 'Freedom of Communication of Thoughts and Opinions',
      originalText: 'The free communication of thoughts and of opinions is one of the most precious rights of man: any citizen may thus speak, write, print freely, except to respond to the abuse of this liberty in the cases determined by law.',
      simplifiedExplanation: 'A cornerstone of the French Republic, this guarantees that citizens can write, publish, and speak their thoughts freely. However, they can be held responsible if they misuse this freedom, such as by committing slander (lying to ruin someone\'s reputation) or inciting violence.',
      childFriendlyExplanation: 'You are allowed to speak your mind, print newspapers, and write blogs about whatever you want. But you must not tell lies about people or encourage people to do bad things.',
      realLifeExample: 'An artist paints a caricature poking fun at the President. The police cannot confiscate the artwork or arrest the artist, as political satire is protected under freedom of opinion.',
      keyTakeaways: 'Right to speak, write, and print freely.\nDefined as one of the most precious human rights.\nAbuse of this liberty (like hate speech or libel) can be legally punished.',
      topic: 'Freedom of Speech',
    },

    // Japan Articles
    {
      countryId: japan.id,
      articleNumber: 'Article 9',
      title: 'Renunciation of War',
      originalText: 'Aspiring sincerely to an international peace based on justice and order, the Japanese people forever renounce war as a sovereign right of the nation and the threat or use of force as means of settling international disputes. In order to accomplish the aim... land, sea, and air forces, as well as other war potential, will never be maintained. The right of belligerency of the state will not be recognized.',
      simplifiedExplanation: 'This article makes Japan unique. It formally renounces the right to wage war or use military force to solve arguments with other countries. It states Japan will not maintain a standard offensive army, navy, or air force, though it has been interpreted to allow a Self-Defense Force (JSDF) solely for protecting the country if attacked.',
      childFriendlyExplanation: 'Japan promises to always solve fights with other countries by talking and being peaceful, rather than fighting wars. They promise not to use weapons or armies to bully others.',
      realLifeExample: 'Japan cannot send its Self-Defense Forces to join an offensive military invasion of another country, because its constitution only permits military actions for direct self-defense.',
      keyTakeaways: 'Renounces offensive war and the threat of force.\nNo offensive military capability.\nPacifism as a core constitutional pillar.',
      topic: 'Federalism',
    },
    {
      countryId: japan.id,
      articleNumber: 'Article 14(1)',
      title: 'Equality Under the Law',
      originalText: 'All of the people are equal under the law and there shall be no discrimination in political, economic or social relations because of race, creed, sex, social status or family origin.',
      simplifiedExplanation: 'This article guarantees equal treatment under the law. It forbids discrimination based on race, religion (creed), gender, social status, or family history (which historically protected the Burakumin caste).',
      childFriendlyExplanation: 'No matter what you look like, what you believe, or whether your family is rich or poor, the law in Japan must treat you exactly like everybody else.',
      realLifeExample: 'The government cannot pass a law that pays male public officials a higher salary than female public officials for doing the exact same job.',
      keyTakeaways: 'Equal protection for all Japanese citizens.\nNo discrimination by gender, race, religion, or social class.\nBanned the old imperial aristocratic peerage system.',
      topic: 'Fundamental Rights',
    }
  ];

  for (const article of articlesData) {
    await prisma.article.create({
      data: article,
    });
  }

  console.log('Seeding amendments...');

  const amendmentsData = [
    {
      countryId: india.id,
      title: '42nd Amendment Act',
      year: '1976',
      description: 'Often called the "Mini-Constitution" of India, it was passed during the Emergency. It made major changes to the constitution, including adding the words "Socialist", "Secular", and "Integrity" to the Preamble, and establishing the Fundamental Duties of citizens.',
      detail: 'Added Part IV-A (Article 51A) on Fundamental Duties. Transferred five subjects (like education and forests) from the State list to the Concurrent list, giving the Union government more control.',
    },
    {
      countryId: usa.id,
      title: 'Fourteenth Amendment',
      year: '1868',
      description: 'One of the Reconstruction Amendments passed after the Civil War. It granted citizenship to all persons born or naturalized in the United States—including former slaves—and guaranteed all citizens "equal protection of the laws" and "due process."',
      detail: 'Used by the Supreme Court to apply the Bill of Rights to state governments, ensuring states cannot pass laws that violate basic freedoms like speech or due process.',
    },
    {
      countryId: france.id,
      title: 'Constitutional Law of 2000 (Five-Year Term)',
      year: '2000',
      description: 'Reduced the presidential term of office (septennat) from seven years to five years (quinquennat). This was done to match the legislative term and reduce the chances of "cohabitation" (where the President and Prime Minister belong to rival parties).',
      detail: 'Ensures presidential and parliamentary elections take place in the same year, strengthening the President\'s mandate and government stability.',
    }
  ];

  for (const amendment of amendmentsData) {
    await prisma.amendment.create({
      data: amendment,
    });
  }

  console.log('Seeding quiz questions...');

  const quizzesData = [
    // Easy
    {
      countryId: india.id,
      topic: 'Fundamental Rights',
      type: 'MCQ',
      difficulty: 'EASY',
      question: 'Which article of the Indian Constitution guarantees "Equality Before Law"?',
      options: JSON.stringify(['Article 12', 'Article 14', 'Article 19', 'Article 21']),
      correctAnswer: 'Article 14',
      explanation: 'Article 14 of the Indian Constitution states that the State shall not deny to any person equality before the law or the equal protection of the laws.',
    },
    {
      countryId: usa.id,
      topic: 'Freedom of Speech',
      type: 'MCQ',
      difficulty: 'EASY',
      question: 'Which Amendment to the US Constitution guarantees freedom of speech, religion, and the press?',
      options: JSON.stringify(['First Amendment', 'Second Amendment', 'Fifth Amendment', 'Tenth Amendment']),
      correctAnswer: 'First Amendment',
      explanation: 'The First Amendment guarantees the freedom of speech, religion, the press, assembly, and petition.',
    },
    // Medium
    {
      countryId: japan.id,
      topic: 'Federalism',
      type: 'TF',
      difficulty: 'MEDIUM',
      question: 'Under Article 9 of the Japanese Constitution, Japan retains the right to launch offensive wars to settle international disputes.',
      options: JSON.stringify(['True', 'False']),
      correctAnswer: 'False',
      explanation: 'Article 9 explicitly renounces war as a sovereign right of the nation and the threat or use of force as a means of settling international disputes.',
    },
    {
      countryId: uk.id,
      topic: 'Judicial Review',
      type: 'MCQ',
      difficulty: 'MEDIUM',
      question: 'Which historic UK document signed in 1215 established that the King is not above the law?',
      options: JSON.stringify(['The Bill of Rights', 'Magna Carta', 'The Habeas Corpus Act', 'The Human Rights Act']),
      correctAnswer: 'Magna Carta',
      explanation: 'Magna Carta, signed by King John in 1215, was the first written charter to establish that the monarch and government are subject to the law.',
    },
    // Hard (Scenario)
    {
      countryId: usa.id,
      topic: 'Judicial Review',
      type: 'SCENARIO',
      difficulty: 'HARD',
      question: 'A suspect is arrested by the police and interrogated for 10 hours straight. The police tell the suspect they will not let them leave or see a lawyer until they confess to the crime. Which constitutional right has been violated?',
      options: JSON.stringify(['First Amendment (Speech)', 'Second Amendment (Bear Arms)', 'Fifth Amendment (Due Process / Self-Incrimination)', 'Tenth Amendment (State Rights)']),
      correctAnswer: 'Fifth Amendment (Due Process / Self-Incrimination)',
      explanation: 'The Fifth Amendment protects individuals from being compelled to be a witness against themselves and ensures they cannot be deprived of liberty without due process, including the right to remain silent and have a fair interrogation process.',
    },
    {
      countryId: india.id,
      topic: 'Freedom of Speech',
      type: 'BLANK',
      difficulty: 'HARD',
      question: 'Although Article 19(1)(a) protects freedom of speech in India, the government can place limits on it under Article 19(2). These limits are known as _______ restrictions.',
      options: JSON.stringify([]),
      correctAnswer: 'reasonable',
      explanation: 'Article 19(2) allows the State to impose "reasonable restrictions" on the freedom of speech and expression in the interests of sovereignty, security, public order, decency, or morality.',
    }
  ];

  for (const quiz of quizzesData) {
    await prisma.quizQuestion.create({
      data: quiz,
    });
  }

  console.log('Seeding learning lessons...');

  const lessonsData = [
    // Student path
    {
      roleTarget: 'STUDENT',
      dayNumber: 1,
      title: 'Introduction to Constitutions',
      content: 'A constitution is the supreme law book of a country. It sets the rules for how a nation is run, who holds power, and how citizens are protected. In this lesson, you will learn the difference between written (like the US and India) and unwritten/uncodified constitutions (like the UK).',
    },
    {
      roleTarget: 'STUDENT',
      dayNumber: 2,
      title: 'Understanding Separation of Powers',
      content: 'Governments are split into three branches to keep them from becoming too powerful: the Legislative (makes laws), the Executive (enforces laws), and the Judicial (interprets laws). This is called the Separation of Powers.',
    },
    // Citizen path
    {
      roleTarget: 'CITIZEN',
      dayNumber: 1,
      title: 'Knowing Your Fundamental Rights',
      content: 'As a citizen, your constitution grants you rights that the government cannot take away. For example, Article 14 in India guarantees equality, while the First Amendment in the US protects free speech. Knowing these rights helps you protect yourself and stand up for others.',
    },
    {
      roleTarget: 'CITIZEN',
      dayNumber: 2,
      title: 'How Elections Work',
      content: 'Elections are the heartbeat of democracy. Constitutions write the rules for who can vote, how votes are counted, and how often we choose our leaders. In some countries (like France), the President is elected directly, while in others (like the UK and India), citizens elect MPs who then form a government.',
    }
  ];

  for (const lesson of lessonsData) {
    await prisma.learningLesson.create({
      data: lesson,
    });
  }

  console.log('Seeding prompt configurations...');
  const promptsData = [
    {
      name: 'chat',
      systemPrompt: 'You are the Constitution Atlas AI Assistant. Your job is to explain constitutional concepts, articles, rights, and history in simple, plain English. When asked, refer to the provided constitutional texts. Break down complex legal jargon. Explain at a level a 13-year-old can easily understand. Avoid making up information; stick to the facts and documents.',
      temperature: 0.2,
    },
    {
      name: 'simplified',
      systemPrompt: 'Simplify the following constitutional text into clear, plain English that is easy to read. Avoid legal jargon.',
      temperature: 0.3,
    },
    {
      name: 'child',
      systemPrompt: 'Explain this constitutional article to a 10-year-old child using a relatable game analogy or very simple vocabulary.',
      temperature: 0.5,
    }
  ];

  for (const prompt of promptsData) {
    await prisma.promptConfig.create({
      data: prompt,
    });
  }

  console.log('Creating Admin User...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@constitutionatlas.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
