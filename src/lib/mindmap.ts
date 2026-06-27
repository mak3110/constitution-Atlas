export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
}

export const mindMapsData: Record<string, MindMapNode> = {
  'Freedom of Speech': {
    name: 'Freedom of Speech',
    children: [
      {
        name: 'India (Article 19)',
        children: [
          { name: 'Core Guarantee', children: [{ name: 'Express views via writing, speech, art' }] },
          { name: 'Restrictions', children: [{ name: 'Public order, national security, decency' }] }
        ]
      },
      {
        name: 'United States (1st Amendment)',
        children: [
          { name: 'Core Guarantee', children: [{ name: 'No government censorship of speech/press' }] },
          { name: 'Limits', children: [{ name: 'Incitement to violence, defamation, threats' }] }
        ]
      },
      {
        name: 'France (1789 Declaration)',
        children: [
          { name: 'Article 11', children: [{ name: 'Free communication of thoughts & opinions' }] },
          { name: 'Limits', children: [{ name: 'Liability for abuse defined by parliament' }] }
        ]
      },
      {
        name: 'Japan (Article 21)',
        children: [
          { name: 'Core Guarantee', children: [{ name: 'Freedom of speech, press & association' }] },
          { name: 'Limits', children: [{ name: 'Censorship strictly banned; public welfare' }] }
        ]
      }
    ]
  },
  'Fundamental Rights': {
    name: 'Fundamental Rights',
    children: [
      {
        name: 'India (Part III)',
        children: [
          { name: 'Right to Equality (Art 14)' },
          { name: 'Right to Freedom (Art 19)' },
          { name: 'Right to Life & Liberty (Art 21)' }
        ]
      },
      {
        name: 'United States (Bill of Rights)',
        children: [
          { name: 'Free Speech & Religion (1st)' },
          { name: 'Due Process & Silence (5th)' },
          { name: 'Equal Protection (14th)' }
        ]
      },
      {
        name: 'France (Declaration of 1789)',
        children: [
          { name: 'Liberty, Property & Security' },
          { name: 'Equality under the Law' }
        ]
      },
      {
        name: 'Japan (Chapter III)',
        children: [
          { name: 'Equality under Law (Art 14)' },
          { name: 'Wholesome Living (Art 25)' }
        ]
      }
    ]
  },
  'Separation of Powers': {
    name: 'Separation of Powers',
    children: [
      {
        name: 'Legislative',
        children: [
          { name: 'US: Congress (Bicameral)' },
          { name: 'India: Parliament (Bicameral)' },
          { name: 'Japan: National Diet' },
          { name: 'France: Parliament' }
        ]
      },
      {
        name: 'Executive',
        children: [
          { name: 'US: President (Head of State & Gov)' },
          { name: 'India: Prime Minister (President is ceremonial)' },
          { name: 'France: Split (President & Prime Minister)' },
          { name: 'UK: Prime Minister (King is ceremonial)' }
        ]
      },
      {
        name: 'Judiciary',
        children: [
          { name: 'US: Supreme Court (Strict separation)' },
          { name: 'India: Supreme Court (Integrated system)' },
          { name: 'UK: Supreme Court (Devolved / Sovereign Parliament)' }
        ]
      }
    ]
  },
  'Federalism': {
    name: 'Federalism',
    children: [
      {
        name: 'Strong Federal (US)',
        children: [
          { name: 'Sovereignty split between Washington and 50 States' },
          { name: '10th Amendment preserves State powers' }
        ]
      },
      {
        name: 'Quasi-Federal (India)',
        children: [
          { name: 'Unitary bias (Central emergency powers)' },
          { name: '3 legislative lists: Union, State, Concurrent' }
        ]
      },
      {
        name: 'Unitary Systems',
        children: [
          { name: 'France: Centrally controlled departments' },
          { name: 'Japan: Prefectures but centralized authority' },
          { name: 'UK: Devolved parliaments (Scotland, Wales, NI)' }
        ]
      }
    ]
  },
  'Judicial Review': {
    name: 'Judicial Review',
    children: [
      {
        name: 'US System',
        children: [
          { name: 'Established in Marbury v. Madison (1803)' },
          { name: 'Supreme Court can strike down Congress laws' }
        ]
      },
      {
        name: 'Indian System',
        children: [
          { name: 'Explicitly in Article 13 & 32' },
          { name: 'Basic Structure Doctrine (cannot alter core values)' }
        ]
      },
      {
        name: 'French System',
        children: [
          { name: 'Constitutional Council checks laws before enactment' }
        ]
      }
    ]
  },
  'Elections': {
    name: 'Constitutional Elections',
    children: [
      {
        name: 'Presidential (US)',
        children: [
          { name: 'Electoral College system' },
          { name: 'Fixed 4-year terms' }
        ]
      },
      {
        name: 'Parliamentary (UK, India, Japan)',
        children: [
          { name: 'First-past-the-post constituency voting' },
          { name: 'PM chosen by legislative majority' }
        ]
      },
      {
        name: 'Semi-Presidential (France)',
        children: [
          { name: 'Direct presidential election (two-round system)' },
          { name: 'National Assembly legislative elections' }
        ]
      }
    ]
  },
  'Government Structure': {
    name: 'Government Structure',
    children: [
      { name: 'US: Presidential Federal Republic' },
      { name: 'India: Parliamentary Federal Republic' },
      { name: 'UK: Constitutional Parliamentary Monarchy' },
      { name: 'France: Semi-Presidential Republic' },
      { name: 'Japan: Constitutional Parliamentary Monarchy' }
    ]
  }
};
