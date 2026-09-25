export type JournalPath = 'personal' | 'meditation' | 'manifestation' | 'affirmation';

export const journalGuides: Record<JournalPath, { label: string; instruction: string; questions: string[]; example: string }> = {
  personal: {
    label: 'Understand myself',
    instruction: 'Take two quiet minutes. Choose one question and write a few honest sentences. There is no right answer; you may skip anything that feels too personal.',
    questions: ['What am I feeling today, and what may have contributed to it?', 'What do I need more of right now: rest, support, connection or space?', 'When did I feel most like myself today?', 'What matters to me, and how did I honour it today?'],
    example: 'Today I feel… I noticed this when… What I need now is…',
  },
  meditation: {
    label: 'After meditation',
    instruction: 'Pause before moving on. Notice your body, breathing and mood without judging the session. Feeling unchanged is a valid observation too.',
    questions: ['What do I notice in my body and breathing now?', 'What, if anything, has changed since I began?', 'When my attention wandered, what helped me return?', 'What gentle intention will I carry into the rest of my day?'],
    example: 'Before the practice I felt… Now I notice… One thing I will carry with me is…',
  },
  manifestation: {
    label: 'After manifestation',
    instruction: 'Connect your inner practice to a real next step. Describe what you imagined, what felt difficult and one action within your control. Record observations without needing to prove a result.',
    questions: ['What did I picture myself doing during my visualization?', 'What doubt or obstacle came up, and how could I respond kindly?', 'What small action will I take, and when will I do it?', 'What actually happened after my last action, and what can I learn?'],
    example: 'My goal matters because… I pictured… My next action is… I will do it at…',
  },
  affirmation: {
    label: 'After affirmations',
    instruction: 'Repeat your chosen words slowly, then notice your response. You do not have to force a positive feeling. Explore what feels believable and how to practise it.',
    questions: ['Which words felt believable or encouraging today?', 'Which words brought up doubt, and what support would help?', 'What small action could express this affirmation today?'],
    example: 'The words I repeated were… I felt… Today I can live these words by…',
  },
};
