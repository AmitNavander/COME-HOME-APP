/** Support resources verified with the helpline directory on 17 October 2026. */
export type Resource = { id: string; label: string; detail: string; href: string };
export const CRISIS_RESOURCES: Resource[] = [
  { id: 'talk', label: 'Call Tele-MANAS · 14416', detail: 'India · Free mental health support, available 24/7. Opens your phone app.', href: 'tel:+9114416?oai_link_source=model_response_hotline' },
  { id: 'website', label: 'Visit Tele-MANAS', detail: 'Learn about the service on its official website. Opens in a new tab.', href: 'https://telemanas.mohfw.gov.in/home?oai_link_source=model_response_hotline' },
];
