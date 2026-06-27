'use client';

import { useState } from 'react';
import { GitFork, Shield, Scale, Landmark, UserCheck, LayoutGrid, HelpCircle } from 'lucide-react';

interface ComparisonDetail {
  title: string;
  summary: string;
  points: string[];
}

const comparisonDatabase: Record<string, Record<string, ComparisonDetail>> = {
  IN: {
    rights: {
      title: 'Fundamental Rights (Part III)',
      summary: 'Six categories of justiciable rights. They are comprehensive, but explicitly limitable by "reasonable restrictions" (like public order or national security).',
      points: [
        'Right to Equality (Article 14-18)',
        'Right to Freedom of Speech & Expression (Article 19)',
        'Right to Constitutional Remedies (Article 32) allows direct appeal to Supreme Court',
        'Includes explicit protections against social discrimination and untouchability'
      ]
    },
    speech: {
      title: 'Freedom of Speech (Article 19)',
      summary: 'Guarantees free speech but contains Article 19(2) which lists explicit central restrictions like sovereignty, security, and public order.',
      points: [
        'Subject to "reasonable restrictions"',
        'Speech can be curbed to maintain public morality or friendly relations with foreign states',
        'Includes right to silence and press freedom, though not explicitly stated in text'
      ]
    },
    judiciary: {
      title: 'Integrated Judiciary',
      summary: 'A single, unified pyramid judicial system with the Supreme Court at the top, managing all central and state laws.',
      points: [
        'Judges appointed via the Collegium system',
        'Features the unique "Basic Structure Doctrine" (judiciary can strike down amendments that alter core tenets)',
        'High Courts oversee states, but report directly to the Supreme Court'
      ]
    },
    elections: {
      title: 'Parliamentary Elections',
      summary: 'Bicameral legislature based on the Westminster system. The political party holding the majority in the Lok Sabha elects the Prime Minister.',
      points: [
        'First-Past-The-Post voting in Lok Sabha general elections',
        'Independent Election Commission of India (ECI) manages process',
        'Universal adult suffrage since 1950'
      ]
    },
    federal: {
      title: 'Quasi-Federal with Unitary Bias',
      summary: 'Power is divided, but the union government retains dominant control. In emergencies, the center can take full control of state administrations.',
      points: [
        'Three lists: Union list, State list, and Concurrent list',
        'Residuary powers belong solely to the Central Union government',
        'Governors of states are appointed by the Central President'
      ]
    },
    executive: {
      title: 'Parliamentary Executive Cabinet',
      summary: 'Dual executive structure. The President is the formal Head of State, but the Prime Minister is the Head of Government holding real power.',
      points: [
        'Prime Minister must hold a majority in the elected Lok Sabha',
        'Cabinet is collectively responsible to the parliament',
        'President acts on the binding advice of the Council of Ministers'
      ]
    }
  },
  US: {
    rights: {
      title: 'Bill of Rights (First 10 Amendments)',
      summary: 'Individual liberties formulated as "negative rights" (prohibiting the federal Congress from acting to restrict freedoms). Highly absolute.',
      points: [
        'Protections for Speech, Religion, and Press (1st Amendment)',
        'Right to bear arms (2nd Amendment)',
        'Protection against self-incrimination & due process (5th Amendment)',
        'Rights not listed are reserved to the states/people (10th Amendment)'
      ]
    },
    speech: {
      title: 'Absolute Free Speech (1st Amendment)',
      summary: 'Extremely broad protections. The government cannot restrict speech unless it constitutes direct incitement to imminent lawless action, defamation, or true threats.',
      points: [
        'No concept of general "reasonable restrictions" by Congress',
        'Hate speech, political spending, and offensive expressions are constitutionally protected',
        'Prior restraint (censorship before printing) is strictly prohibited'
      ]
    },
    judiciary: {
      title: 'Dual Judicial System',
      summary: 'Separate Federal courts (handling federal laws & constitutionality) and State courts (handling state laws). Led by the US Supreme Court.',
      points: [
        'Judges nominated by President, confirmed by the Senate for life terms',
        'Established Judicial Review power in Marbury v. Madison (1803)',
        'Strict separation of powers prevents advisory opinions'
      ]
    },
    elections: {
      title: 'Presidential & Congressional Elections',
      summary: 'President is elected indirectly via the Electoral College every 4 years. Congress members are elected in direct district elections.',
      points: [
        'Electoral College can result in winner of popular vote losing the presidency',
        'Congressional districts are subject to boundary resets (Gerrymandering)',
        'State governments control election administration rules'
      ]
    },
    federal: {
      title: 'Strong Federal Structure',
      summary: 'High degree of state sovereignty. States have their own constitutions, supreme courts, governors, and police forces.',
      points: [
        'Federal government only holds powers explicitly granted by the Constitution',
        'All other powers remain with individual states (10th Amendment)',
        'Amendment process requires approval from 3/4 of the states'
      ]
    },
    executive: {
      title: 'Presidential Executive',
      summary: 'The President is a single executive serving as both Head of State and Head of Government, operating independently of Congress.',
      points: [
        'President holds constitutional veto power over laws passed by Congress',
        'Elected independently of the legislature (separation of powers)',
        'Can only be removed before term end via Impeachment'
      ]
    }
  },
  UK: {
    rights: {
      title: 'Human Rights Act & Statues',
      summary: 'Uncodified rights protected through common law traditions, historical documents, and the Human Rights Act 1998.',
      points: [
        'Magna Carta (1215) established trial by jury and due process rules',
        'Bill of Rights (1689) limited monarch powers and secured parliamentary privilege',
        'Human Rights Act 1998 allows courts to review laws for compliance with European Convention'
      ]
    },
    speech: {
      title: 'Common Law Speech Protection',
      summary: 'Speech is protected under common law and the Human Rights Act, but Parliament retains absolute sovereignty to enact speech limits.',
      points: [
        'No supreme codified document protecting speech from Parliament actions',
        'Strict libel laws and public safety laws (incitement to racial hatred) exist',
        'Parliamentary Privilege protects speech spoken inside parliament chambers'
      ]
    },
    judiciary: {
      title: 'Supreme Court & Parliamentary Sovereignty',
      summary: 'The Supreme Court of the UK is independent but cannot strike down primary Acts of Parliament due to the doctrine of Parliamentary Sovereignty.',
      points: [
        'Supreme Court created in 2009 (previously Law Lords in Parliament)',
        'Can issue "declarations of incompatibility" for human rights violations, but cannot void laws',
        'Independent judicial appointments committee'
      ]
    },
    elections: {
      title: 'Westminster Parliamentary Elections',
      summary: 'General elections occur at least every 5 years. Members of the House of Commons are elected in single-member constituencies.',
      points: [
        'Strict First-Past-The-Post voting structure',
        'The leader of the majority party in Commons is invited by the King to be PM',
        'House of Lords is unelected (consists of life peers and bishops)'
      ]
    },
    federal: {
      title: 'Unitary State with Devolution',
      summary: 'The Westminster Parliament is constitutionally supreme, but devolved powers are granted to Scotland, Wales, and Northern Ireland.',
      points: [
        'Devolved assemblies control local policies like health and education',
        'Sovereignty remains with Westminster, which can theoretically repeal devolution',
        'No state/regional constitutions'
      ]
    },
    executive: {
      title: 'Parliamentary Constitutional Monarchy',
      summary: 'Executive cabinet drawn directly from the legislature. The Monarch is head of state; the Prime Minister is head of government.',
      points: [
        'Prime Minister is an active MP leading the majority coalition',
        'Cabinet operates under "collective ministerial responsibility"',
        'Monarch acts on Prime Minister\'s advice using "royal prerogative"'
      ]
    }
  },
  FR: {
    rights: {
      title: '1789 Declaration & Preamble Rights',
      summary: 'Rights are contained in the "constitutional bloc" (Bloc de constitutionnalité), which includes the famous 1789 Declaration of Rights.',
      points: [
        'Declaration of the Rights of Man: Liberty, equality, property, security',
        'Preamble to the 1946 Constitution adds social rights (equality for women, strike)',
        'Environmental Charter (2004) adds right to live in balanced environment'
      ]
    },
    speech: {
      title: 'Qualified Free Speech (Art 11)',
      summary: 'Guarantees free speech in writing and printing, but explicitly subjects citizens to liability for "abuse of this liberty" under legislative terms.',
      points: [
        'Hate speech, Holocaust denial, and defamation are illegal',
        'Laïcité (secularism) prevents religious expressions from interfering in state duties',
        'Prior censorship is prohibited, but legal accountability for output is high'
      ]
    },
    judiciary: {
      title: 'Dual Court & Constitutional Council',
      summary: 'Split judicial structure: Administrative courts (led by Conseil d\'État) and Judicial courts. The Constitutional Council reviews laws.',
      points: [
        'Constitutional Council (Conseil constitutionnel) rules on constitutionality of laws',
        'Allows review of bills *before* they are signed into law (a priori review)',
        'Judges are career civil servants, not political appointees'
      ]
    },
    elections: {
      title: 'Two-Round Majority Elections',
      summary: 'Unique voting structures. The President is directly elected, and the National Assembly uses a two-round single-member constituency system.',
      points: [
        'Presidential election goes to a run-off between top 2 candidates if no majority',
        'High voter turnout standard due to Sunday polling',
        'Senate is elected indirectly by regional politicians (grand électeurs)'
      ]
    },
    federal: {
      title: 'Unitary Decentralized State',
      summary: 'France is constitutionally unified and indivisible. Power is decentralized to regions and departments, but they have no legislative autonomy.',
      points: [
        'No regional constitutions or supreme courts',
        'All laws are passed centrally by the French Parliament in Paris',
        'Regional prefects represent the central government locally'
      ]
    },
    executive: {
      title: 'Semi-Presidential Executive',
      summary: 'Split executive. The directly elected President holds foreign and defense powers, while the Prime Minister controls domestic affairs.',
      points: [
        'President holds the power to dissolve the National Assembly',
        'Prime Minister is responsible to the National Assembly and can be ousted via motion of no confidence',
        'Cohabitation occurs when President and Prime Minister are from rival parties'
      ]
    }
  },
  JP: {
    rights: {
      title: 'Chapter III Rights of the People',
      summary: 'A very detailed list of 30+ rights heavily influenced by the US Bill of Rights after WWII, guaranteeing social and individual safety.',
      points: [
        'Equality under the Law (Article 14)',
        'Academic freedom is explicitly guaranteed (Article 23)',
        'Right to maintain minimum wholesome and cultured living standards (Article 25)',
        'No censorship of media (Article 21)'
      ]
    },
    speech: {
      title: 'Absolute Speech Guarantee (Art 21)',
      summary: 'Strictly prohibits all forms of government censorship. However, courts can limit expressions that violate the general "public welfare."',
      points: [
        'Strict ban on prior censorship of speech, press, and writing',
        'Privacy of communication is absolute and protected',
        'Public welfare clause can be used to balance rights against social harm'
      ]
    },
    judiciary: {
      title: 'Unified Judicial Review',
      summary: 'A single, independent judicial branch headed by the Supreme Court of Japan, carrying constitutional review authority over all state acts.',
      points: [
        'Judges appointed by the Cabinet, subject to public review at general elections',
        'Constitutional review powers are explicitly stated in Article 81',
        'Supreme Court is famously conservative in striking down Diet legislation'
      ]
    },
    elections: {
      title: 'Bicameral Diet Elections',
      summary: 'The Diet consists of the House of Representatives and the House of Councillors, elected via a mixture of constituency and proportional lists.',
      points: [
        'Prime Minister is chosen by a vote of the Diet (parliament)',
        'House of Representatives holds ultimate supremacy in budget and treaties',
        'A single party (LDP) has dominantly held legislative control since 1955'
      ]
    },
    federal: {
      title: 'Unitary Decentralized State',
      summary: 'Japan is a unitary country divided into 47 Prefectures. Local governments handle administration, but laws are uniform and central.',
      points: [
        'Prefectural governors are directly elected by residents',
        'Local assemblies pass ordinances, but they must not contradict Diet laws',
        'No state/prefectural courts exist; all courts are national'
      ]
    },
    executive: {
      title: 'Parliamentary Cabinet System',
      summary: 'The Emperor is a ceremonial symbol. Real executive power is held by the Prime Minister and the Cabinet, who must report to the Diet.',
      points: [
        'Prime Minister must be a civilian MP',
        'Majority of Cabinet Ministers must be members of the Diet',
        'Emperor appoints the PM designated by the Diet'
      ]
    }
  }
};

const topicIcons: Record<string, any> = {
  rights: Shield,
  speech: Scale,
  judiciary: Landmark,
  elections: UserCheck,
  federal: LayoutGrid,
  executive: HelpCircle
};

export default function ComparePage() {
  const [countryA, setCountryA] = useState('IN');
  const [countryB, setCountryB] = useState('US');
  const [topic, setTopic] = useState('rights');

  const detailA = comparisonDatabase[countryA]?.[topic];
  const detailB = comparisonDatabase[countryB]?.[topic];
  const TopicIcon = topicIcons[topic];

  const countries = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' }
  ];

  const topics = [
    { id: 'rights', name: 'Fundamental Rights' },
    { id: 'speech', name: 'Freedom of Speech' },
    { id: 'judiciary', name: 'Judiciary' },
    { id: 'elections', name: 'Elections' },
    { id: 'federal', name: 'Federal Structure' },
    { id: 'executive', name: 'Executive Powers' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white flex items-center justify-center space-x-3">
          <GitFork className="h-10 w-10 text-indigo-500" />
          <span>Constitution Comparison Tool</span>
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
          Select two countries and a topic to compare legal systems, checks and balances, and rights side-by-side.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="glass-card p-6 rounded-2xl grid md:grid-cols-3 gap-6 shadow-lg">
        {/* Country A Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Country A</label>
          <select
            value={countryA}
            onChange={(e) => setCountryA(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg glass-input text-white bg-zinc-900 font-semibold cursor-pointer"
          >
            {countries.map(c => (
              <option key={c.code} value={c.code} disabled={c.code === countryB}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Topic Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Comparison Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg glass-input text-white bg-zinc-900 font-semibold cursor-pointer"
          >
            {topics.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Country B Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Country B</label>
          <select
            value={countryB}
            onChange={(e) => setCountryB(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg glass-input text-white bg-zinc-900 font-semibold cursor-pointer"
          >
            {countries.map(c => (
              <option key={c.code} value={c.code} disabled={c.code === countryA}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Country A Detail Card */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border-t-4 border-indigo-500 relative">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">{countries.find(c => c.code === countryA)?.flag}</span>
            <h2 className="text-2xl font-black text-white">
              {countries.find(c => c.code === countryA)?.name}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <TopicIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{detailA?.title}</h3>
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                  {detailA?.summary}
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-850 pt-4 space-y-3.5">
              <h4 className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Core Constitutional Provisions</h4>
              <ul className="space-y-2.5">
                {detailA?.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-zinc-200 text-sm leading-relaxed">
                    <span className="text-indigo-400 font-bold mr-1">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Country B Detail Card */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border-t-4 border-amber-500 relative">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">{countries.find(c => c.code === countryB)?.flag}</span>
            <h2 className="text-2xl font-black text-white">
              {countries.find(c => c.code === countryB)?.name}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <TopicIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{detailB?.title}</h3>
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                  {detailB?.summary}
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-850 pt-4 space-y-3.5">
              <h4 className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Core Constitutional Provisions</h4>
              <ul className="space-y-2.5">
                {detailB?.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-zinc-200 text-sm leading-relaxed">
                    <span className="text-amber-400 font-bold mr-1">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Matrix Table */}
      <div className="glass-card p-6 rounded-2xl space-y-6">
        <h3 className="text-xl font-bold text-white">Constitutional Comparison Matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-xs">
                <th className="py-3 px-4">Topic Area</th>
                <th className="py-3 px-4">{countries.find(c => c.code === countryA)?.name}</th>
                <th className="py-3 px-4">{countries.find(c => c.code === countryB)?.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-zinc-300">
              <tr className="hover:bg-zinc-850/20 transition">
                <td className="py-4 px-4 font-bold text-white">Legal System</td>
                <td className="py-4 px-4">{countryA === 'UK' ? 'Uncodified organic statutes & common law' : 'Codified written constitution'}</td>
                <td className="py-4 px-4">{countryB === 'UK' ? 'Uncodified organic statutes & common law' : 'Codified written constitution'}</td>
              </tr>
              <tr className="hover:bg-zinc-850/20 transition">
                <td className="py-4 px-4 font-bold text-white">Executive Power</td>
                <td className="py-4 px-4">{countryA === 'US' ? 'Presidential (Single Executive)' : countryA === 'FR' ? 'Semi-Presidential (Dual Executive)' : 'Parliamentary Cabinet'}</td>
                <td className="py-4 px-4">{countryB === 'US' ? 'Presidential (Single Executive)' : countryB === 'FR' ? 'Semi-Presidential (Dual Executive)' : 'Parliamentary Cabinet'}</td>
              </tr>
              <tr className="hover:bg-zinc-850/20 transition">
                <td className="py-4 px-4 font-bold text-white">Structure of State</td>
                <td className="py-4 px-4">{countryA === 'US' ? 'Federal States Union' : countryA === 'IN' ? 'Quasi-Federal Republic' : 'Unitary State'}</td>
                <td className="py-4 px-4">{countryB === 'US' ? 'Federal States Union' : countryB === 'IN' ? 'Quasi-Federal Republic' : 'Unitary State'}</td>
              </tr>
              <tr className="hover:bg-zinc-850/20 transition">
                <td className="py-4 px-4 font-bold text-white">Supreme Judicial Arbiter</td>
                <td className="py-4 px-4">{countryA === 'UK' ? 'UK Parliament is supreme sovereign' : 'Supreme Court holds judicial review powers'}</td>
                <td className="py-4 px-4">{countryB === 'UK' ? 'UK Parliament is supreme sovereign' : 'Supreme Court holds judicial review powers'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
