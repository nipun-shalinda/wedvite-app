# Open Card Sections Implementation Plan

## Overview

This plan describes how to rebuild the OPEN STATE of the wedding invitation card (`isOpen === true` block) in `src/app/invite/page.tsx` into 6 distinct, reusable sections with improved UX and animations.

## Current State Analysis

Currently, the open card is rendered as a single large block with all content mixed together. The plan restructures this into 6 logical sections with:
- Better separation of concerns
- Enhanced animations with staggered reveals
- New timeline and countdown features
- Hotel accommodation information
- Improved RSVP experience

## Section Breakdown

### 1. Greet Invitee Section
**Purpose**: Welcome the guest with traditional Kandyan aesthetics

**Components**:
- Top mandala header (existing)
- Couple SVG illustration
- Family introduction lines ("Mr. & Mrs. Herath together with...")
- Personal greeting "Dear {inviteeName}"
- Couple names in script font (Great Vibes)

**Implementation**:
```typescript
function GreetInviteeSection({ card, inviteeName, accent }: SectionProps) {
  return (
    <motion.div
      className="section-wrapper"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Mandala header */}
      {/* Couple SVG */}
      {/* Family lines */}
      {/* Personal greeting */}
      {/* Names */}
    </motion.div>
  );
}
```

### 2. Timeline Section
**Purpose**: Show 4-step wedding day timeline with visual progress

**Components**:
- Vertical timeline with connecting line
- 4 steps: Arrival of Guests, Poruwa Ceremony, Reception, Going Away
- Times from card data (arrivalTime, poruwaTime, receptionTime, goingAwayTime)
- Visual indicators (icons/emojis)

**Implementation**:
```typescript
function TimelineSection({ card, accent }: SectionProps) {
  const timelineSteps = [
    { label: "Arrival of Guests", time: card.arrivalTime, icon: "👥" },
    { label: "Poruwa Ceremony", time: card.poruwaTime, icon: "🪷" },
    { label: "Reception", time: card.receptionTime, icon: "🍽️" },
    { label: "Going Away", time: card.goingAwayTime, icon: "✨" }
  ];
  
  return (
    <motion.div className="timeline-container">
      {timelineSteps.map((step, index) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
        >
          {/* Timeline step implementation */}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### 3. Countdown Section
**Purpose**: Create urgency and excitement with live countdown

**Components**:
- Live countdown to card.date
- 4 units: Days, Hours, Minutes, Seconds
- Real-time updates using useEffect interval
- Elegant number displays with labels

**Implementation**:
```typescript
function CountdownSection({ card, accent }: SectionProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(card.date));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(card.date));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [card.date]);
  
  return (
    <motion.div
      className="countdown-grid"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Days/Hours/Minutes/Seconds display */}
    </motion.div>
  );
}
```

### 4. Hotel & Map Section
**Purpose**: Provide accommodation and location information

**Components**:
- Existing venue information
- New hotel information block (card.hotelName, card.hotelMapLink)
- "Get Directions" links for both venue and hotel
- Split layout or tabbed interface

**Implementation**:
```typescript
function HotelMapSection({ card, accent }: SectionProps) {
  return (
    <motion.div
      className="location-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Venue block */}
      <div className="venue-block">
        <h4>📍 Wedding Venue</h4>
        <p>{card.venue}</p>
        {card.mapLink && (
          <a href={card.mapLink} target="_blank">
            Get Directions to Venue →
          </a>
        )}
      </div>
      
      {/* Hotel block */}
      {card.hotelName && (
        <div className="hotel-block">
          <h4>🏨 Recommended Hotel</h4>
          <p>{card.hotelName}</p>
          {card.hotelMapLink && (
            <a href={card.hotelMapLink} target="_blank">
              Get Directions to Hotel →
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}
```

### 5. RSVP Section
**Purpose**: Collect guest responses with improved UX

**Components**:
- Accept/Decline buttons (existing logic)
- Send RSVP button
- Thank you message after submission
- Response deadline reminder

**Implementation**:
```typescript
function RsvpSection({ 
  card, 
  inviteeName, 
  accent, 
  attending, 
  setAttending, 
  handleRsvp, 
  rsvpDone, 
  sending 
}: RsvpSectionProps) {
  return (
    <motion.div
      className="rsvp-container"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Existing RSVP logic moved here */}
    </motion.div>
  );
}
```

### 6. Thank You Section
**Purpose**: Close with gratitude and traditional elements

**Components**:
- Final gratitude message
- Perahera SVG strip (existing)
- Bottom corner foliage (existing)
- "forever & always" footer (existing)

**Implementation**:
```typescript
function ThankYouSection({ accent }: SectionProps) {
  return (
    <motion.div
      className="thank-you-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <p className="final-message">
        We can't wait to celebrate with you!
      </p>
      
      {/* Perahera SVG */}
      <img src="/images/perahara.svg" alt="Kandyan perahera" />
      
      {/* Bottom foliage and footer */}
      <div className="bottom-foliage">
        <CornerFoliage />
        <p>✦ forever & always ✦</p>
      </div>
    </motion.div>
  );
}
```

## Data Structure Changes

### CardData Interface Updates

**File**: `src/lib/card-data.ts`

Add the following fields to the `CardData` interface:

```typescript
export interface CardData {
  groom: string;
  bride: string;
  date: string;
  time: string;
  poruwaTime: string;
  
  // NEW FIELDS
  arrivalTime: string;        // "8:30 AM"
  receptionTime: string;      // "11:30 AM" 
  goingAwayTime: string;      // "2:00 PM"
  hotelName?: string;         // "Hotel Sigiriya"
  hotelMapLink?: string;      // Google Maps URL for hotel
  
  venue: string;
  mapLink?: string;
  message: string;
  primaryColor: string;
  accentColor: string;
  pattern: string;
  font: string;
}
```

### HARDCODED_CARD Updates

**File**: `src/lib/constants.ts`

Update the hardcoded card data:

```typescript
export const HARDCODED_CARD = {
  groom: "Gayanath",
  bride: "Gayasha",
  date: "2026-12-10",
  time: "9:00 AM",
  poruwaTime: "10:10 AM",
  
  // NEW FIELDS
  arrivalTime: "8:30 AM",
  receptionTime: "11:30 AM", 
  goingAwayTime: "2:00 PM",
  hotelName: "Amaya Grand Hotel",
  hotelMapLink: "https://maps.app.goo.gl/hotelExample123",
  
  venue: "Amaya Grand, 11/9 Malvilawatte, Giriulla,",
  mapLink: "https://maps.app.goo.gl/ierSPVgk8Lu7j7436",
} as const;
```

### Encoding/Decoding Updates

Update the `encodeCardData` and `decodeCardData` functions to handle new fields:

```typescript
export function encodeCardData(card: CardData): string {
  return btoa(encodeURIComponent(JSON.stringify({
    m: card.message,
    p: card.primaryColor,
    a: card.accentColor,
    t: card.pattern,
    f: card.font,
    // Add new timeline fields to encoding
    at: card.arrivalTime,
    rt: card.receptionTime,  
    gt: card.goingAwayTime,
    hn: card.hotelName,
    hm: card.hotelMapLink,
  })));
}
```

## Section Separator Component

**File**: `src/components/LotusDivider.tsx` (if not already in decorations)

```typescript
export function LotusDivider({ color, className }: { color: string; className?: string }) {
  return (
    <div className={`lotus-divider ${className}`}>
      {/* Existing LotusDivider SVG */}
    </div>
  );
}
```

## Animation Strategy

### Staggered Reveals
- Each section animates in with a staggered delay (0.1s increments)
- Use `framer-motion`'s `whileInView` for viewport-triggered animations
- Progressive disclosure creates better UX flow

### Animation Configuration
```typescript
const sectionAnimations = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggeredDelay = (index: number) => ({
  ...sectionAnimations,
  transition: { ...sectionAnimations.transition, delay: index * 0.15 }
});
```

### Viewport Settings
```typescript
const viewportConfig = {
  once: true,    // Animate only once
  margin: "-10%", // Trigger slightly before entering viewport
  amount: 0.3    // 30% of element must be visible
};
```

## File Structure Changes

### New Files to Create

1. **`src/components/invite/sections/GreetInviteeSection.tsx`**
   - Greeting and names display
   - Family introduction lines
   - Mandala header integration

2. **`src/components/invite/sections/TimelineSection.tsx`**
   - 4-step vertical timeline
   - Timeline data integration
   - Animated step reveals

3. **`src/components/invite/sections/CountdownSection.tsx`**
   - Live countdown logic
   - Time calculation utilities
   - Number display components

4. **`src/components/invite/sections/HotelMapSection.tsx`**
   - Venue and hotel information
   - Direction links
   - Location card components

5. **`src/components/invite/sections/RsvpSection.tsx`**
   - RSVP button logic (moved from main file)
   - Response handling
   - Thank you states

6. **`src/components/invite/sections/ThankYouSection.tsx`**
   - Final message and imagery
   - Perahera integration
   - Footer elements

7. **`src/components/invite/sections/index.ts`**
   - Export all sections
   - Common types and interfaces

### Files to Modify

1. **`src/app/invite/page.tsx`**
   - Import section components
   - Replace open card content with section components
   - Maintain existing state management
   - Add section wrapper with animations

2. **`src/lib/card-data.ts`**
   - Add new interface fields
   - Update encoding/decoding logic
   - Maintain backward compatibility

3. **`src/lib/constants.ts`**
   - Add new hardcoded fields
   - Update default card data

## Implementation Sequence

### Phase 1: Data Structure
1. Update `CardData` interface
2. Update `HARDCODED_CARD` 
3. Update encoding/decoding functions
4. Test data flow

### Phase 2: Section Components
1. Create base section components (stub implementations)
2. Move existing content into appropriate sections
3. Test section integration
4. Verify no regressions

### Phase 3: New Features
1. Implement Timeline section
2. Implement Countdown section
3. Implement Hotel information
4. Test new functionality

### Phase 4: Polish & Animation
1. Add staggered animations
2. Fine-tune transitions
3. Optimize performance
4. Cross-browser testing

## Component Interface

### Shared Props Type
```typescript
interface SectionProps {
  card: CardData;
  accent: string;
  primary: string;
  inviteeName: string;
}

interface RsvpSectionProps extends SectionProps {
  attending: boolean | null;
  setAttending: (value: boolean | null) => void;
  handleRsvp: () => Promise<void>;
  rsvpDone: boolean;
  sending: boolean;
  showRsvp: boolean;
  setShowRsvp: (value: boolean) => void;
}
```

### Main Component Integration
```typescript
// In src/app/invite/page.tsx - OPEN STATE section
{isOpen && (
  <motion.div
    key="card"
    className="w-full max-w-sm relative z-10"
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.55, ease: "easeOut" }}
  >
    <div className="card-shell">
      <GreetInviteeSection {...sectionProps} />
      <LotusDivider color={accent} />
      
      <TimelineSection {...sectionProps} />  
      <LotusDivider color={accent} />
      
      <CountdownSection {...sectionProps} />
      <LotusDivider color={accent} />
      
      <HotelMapSection {...sectionProps} />
      <LotusDivider color={accent} />
      
      <RsvpSection {...rsvpSectionProps} />
      <LotusDivider color={accent} />
      
      <ThankYouSection {...sectionProps} />
    </div>
  </motion.div>
)}
```

## Utility Functions

### Countdown Calculation
```typescript
// src/lib/utils/countdown.ts
export function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = +new Date(targetDate) - +new Date();
  
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }
  
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

interface TimeLeft {
  days: number;
  hours: number; 
  minutes: number;
  seconds: number;
}
```

## Styling Approach

### Section Spacing
```css
.section-wrapper {
  @apply px-8 py-6 text-center;
}

.section-wrapper + .lotus-divider {
  @apply my-4 opacity-40;
}
```

### Timeline Styling
```css
.timeline-container {
  @apply flex flex-col gap-4 max-w-xs mx-auto;
}

.timeline-step {
  @apply flex items-center gap-3 text-left;
}

.timeline-connector {
  @apply w-px h-8 mx-4 opacity-30;
  background: linear-gradient(to bottom, currentColor, transparent);
}
```

### Countdown Grid
```css
.countdown-grid {
  @apply grid grid-cols-4 gap-2 max-w-sm mx-auto;
}

.countdown-unit {
  @apply flex flex-col items-center p-3 rounded-lg border;
}
```

## Testing Checklist

### Functionality
- [ ] All sections render correctly
- [ ] Animations work smoothly
- [ ] Countdown updates in real-time
- [ ] RSVP functionality preserved
- [ ] Data encoding/decoding works
- [ ] Hotel information displays when present

### Responsiveness  
- [ ] Mobile layout (max-w-sm)
- [ ] Tablet layout
- [ ] Desktop layout
- [ ] Content overflow handling

### Accessibility
- [ ] Proper heading hierarchy
- [ ] Focus management
- [ ] Screen reader compatibility
- [ ] Color contrast ratios

### Performance
- [ ] Animation performance (60fps)
- [ ] Bundle size impact
- [ ] Memory usage (countdown timers)
- [ ] Image loading optimization

## Rollback Plan

If issues arise during implementation:

1. **Incremental rollback**: Comment out problematic sections
2. **Data rollback**: Revert interface changes if encoding fails
3. **Animation fallback**: Remove animations if performance issues
4. **Component fallback**: Use original monolithic structure

Keep the original open card implementation commented in the file during migration for easy rollback.

## Success Criteria

1. **Functionality**: All existing features work as before
2. **Performance**: No degradation in load times or animation smoothness  
3. **UX**: Improved flow with staggered reveals and logical sections
4. **Maintainability**: Cleaner code structure with reusable components
5. **Accessibility**: No regression in accessibility metrics
6. **Mobile**: Enhanced mobile experience with better content organization

This modular approach will make the invitation card more maintainable, visually appealing, and user-friendly while preserving all existing functionality.