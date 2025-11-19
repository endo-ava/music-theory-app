# UX Psychology Principles

This reference provides detailed UX psychology principles and patterns to inform design decisions that improve user engagement, conversion, and satisfaction.

## Core Principles

### Cognitive Load Management

**Cognitive Load** refers to the mental effort required to process information. Minimize cognitive load to improve user experience.

#### Progressive Disclosure

Reveal information gradually rather than all at once.

**When to use:**

- Complex multi-step processes (registration, checkout, configuration)
- Feature-rich interfaces with advanced options
- Data-heavy dashboards

**Implementation patterns:**

- Accordion menus for nested information
- Step-by-step wizards with progress indicators
- "Advanced options" expandable sections
- Contextual help that appears on demand

**Example applications:**

- Registration forms: Start with email/password, then collect profile details
- Dashboard filters: Show basic filters first, hide advanced filters behind a toggle
- Product configuration: Break complex customization into sequential steps

#### Visual Hierarchy

Establish clear priority through size, color, contrast, and spacing.

**Hierarchy levels:**

1. **Primary**: Main action or critical information (largest, highest contrast)
2. **Secondary**: Supporting actions or context (medium size, moderate contrast)
3. **Tertiary**: Optional details or metadata (smallest, lowest contrast)

**Implementation:**

- Use size and weight to indicate importance
- Apply color to direct attention (sparingly)
- Create whitespace around high-priority elements
- Group related items to reduce mental parsing

---

## Decision-Making Psychology

### Value Perception Effects

#### Anchoring Effect

The first piece of information encountered heavily influences subsequent judgments.

**When to use:**

- Pricing displays
- Setting expectations for form completion time
- Establishing baseline metrics in dashboards

**Implementation patterns:**

- Show original price before discounted price
- Display estimated completion time at the start of a process
- Present context ("Most users complete this in 5 minutes") before task
- Set default values that guide user toward optimal choice

**Anti-patterns to avoid:**

- Manipulative anchoring that misleads users
- Constantly changing anchors that erode trust

#### Framing Effect

How information is presented affects decision-making, even when content is identical.

**Positive framing examples:**

- "95% success rate" vs "5% failure rate"
- "Join 10,000 users" vs "Don't miss out"
- "Save $50" vs "Only $50 more"

**When to use:**

- Call-to-action buttons
- Feature descriptions
- Error messages (reframe as solutions)
- Progress indicators (show completion, not remaining work)

**Implementation:**

- Emphasize gains over losses
- Use action-oriented language
- Focus on benefits, not just features
- Present choices in a context that highlights value

#### Decoy Effect (Asymmetric Dominance)

Adding a third option makes one of the original two options more attractive.

**Classic pattern:**

- **Basic**: $10/month
- **Premium**: $30/month (seems expensive)
- **Pro** (decoy): $28/month with fewer features than Premium

Result: Premium now appears as better value.

**When to use:**

- Pricing tiers
- Feature comparison tables
- Subscription plans

**Guidelines:**

- The decoy should be clearly inferior to the target option
- The decoy should be similar in price to the target
- Use sparingly and ethically

### Loss and Gain Psychology

#### Loss Aversion

People feel losses roughly twice as strongly as equivalent gains.

**When to use:**

- Preventing user churn
- Encouraging feature adoption
- Motivating action completion

**Implementation patterns:**

- "You'll lose your progress if you leave now"
- "Your discount expires in 24 hours"
- "Don't miss out on..." (sparingly, to avoid manipulation)
- Show what users will miss, not just what they'll gain

**Ethical considerations:**

- Avoid creating artificial scarcity or false urgency
- Provide genuine value, not just fear-based motivation
- Balance loss messaging with positive framing

#### Sunk Cost Effect

Users continue investing in something because they've already invested resources.

**When to use:**

- Onboarding flows
- Multi-step processes
- Gamification systems

**Implementation patterns:**

- Progress bars showing completion percentage
- "You're 80% done!" messaging
- Profile completion indicators
- Level/achievement systems that track accumulated effort

**Design considerations:**

- Make progress visible and meaningful
- Provide value at each step, not just at completion
- Allow users to save progress and return later

---

## Attention and Memory

### Peak-End Rule

Users judge experiences based on the peak (most intense moment) and the end, not the average.

**Application in design:**

- Optimize the highest-impact moment in user journey
- Ensure final interaction leaves positive impression
- Don't assume users evaluate the entire experience equally

**Implementation:**

- **Onboarding peak**: Deliver "aha moment" quickly (not after completing entire setup)
- **Purchase end**: Confirmation page with celebration, not just receipt
- **Task completion**: Satisfying animation or acknowledgment
- **Error recovery**: Turn frustrating moment into delightful support experience

**Example patterns:**

- Confetti animation on successful subscription
- Personalized "Welcome aboard!" message with user's name
- Gamified achievements for milestone completion
- Graceful error messages with helpful next steps and personality

### Serial Position Effect

Items at the beginning and end of a list are remembered better than middle items.

**When to use:**

- Navigation menus
- Feature lists
- Pricing comparison tables
- Form field ordering

**Implementation:**

- Place most important items first or last
- Put critical CTAs at the end of content flow
- Position destructive actions (delete, cancel) away from primacy/recency positions
- Use middle positions for less critical items

### Zeigarnik Effect

People remember uncompleted or interrupted tasks better than completed ones.

**When to use:**

- Multi-step processes
- Content consumption experiences
- Task management interfaces
- Gamification

**Implementation patterns:**

- Progress bars that show partial completion
- Checklists with some items checked
- "Continue where you left off" features
- Incomplete profile indicators
- Unfinished lesson/module trackers

**Best practices:**

- Make it easy to resume interrupted tasks
- Don't frustrate users by creating artificial incompleteness
- Provide value even if user doesn't complete everything

---

## Behavioral Design Techniques

### Nudge Theory

Subtle design cues guide users toward beneficial actions without restricting choice.

**When to use:**

- Encouraging best practices
- Improving security behavior
- Promoting healthy usage patterns

**Implementation patterns:**

- Pre-select recommended options (but allow changing)
- Use visual cues to highlight suggested path
- Provide contextual tips at decision points
- Default to privacy-protecting settings

**Examples:**

- Pre-check "Enable two-factor authentication (recommended)"
- Highlight "Most popular" pricing tier
- Show "Other users also..." suggestions
- Default to "Save password securely"

**Ethical guidelines:**

- Nudge toward user's benefit, not just business goals
- Always preserve user autonomy
- Make it easy to choose different option
- Be transparent about recommendations

### Gamification

Apply game mechanics to increase engagement and motivation.

**Core mechanics:**

- **Points/scores**: Quantify progress and achievement
- **Levels/tiers**: Provide progression framework
- **Badges/achievements**: Recognize accomplishments
- **Leaderboards**: Enable social comparison (use carefully)
- **Challenges/quests**: Create structured goals

**When to use:**

- Learning platforms
- Productivity tools
- Community engagement
- Health and fitness applications

**Implementation considerations:**

- Ensure mechanics serve user goals, not just engagement metrics
- Avoid addictive dark patterns
- Provide intrinsic value beyond game elements
- Consider users who don't respond to gamification

### Foot-in-the-Door Technique

Start with small request, then progress to larger commitment.

**When to use:**

- User onboarding
- Permission requests
- Account creation
- Newsletter signup

**Implementation pattern:**

1. Small ask: "Just enter your email"
2. Medium ask: "Tell us your interests"
3. Larger ask: "Create full profile"

**Best practices:**

- Provide value at each step
- Make each step genuinely optional
- Don't hide the full scope of eventual request
- Build trust progressively

### Variable Rewards

Unpredictable rewards create stronger engagement than predictable ones.

**Types:**

- **Rewards of the tribe**: Social validation (likes, follows)
- **Rewards of the hunt**: Material resources (discounts, prizes)
- **Rewards of the self**: Personal achievement (mastery, completion)

**When to use:**

- Social features
- Achievement systems
- Content discovery
- Engagement loops

**Ethical considerations:**

- Avoid creating addictive patterns
- Ensure core value exists beyond reward mechanism
- Don't exploit psychological vulnerabilities
- Consider time-well-spent principles

### Scarcity Effect

Limited availability increases perceived value.

**Types:**

- **Time-limited**: "Offer ends in 24 hours"
- **Quantity-limited**: "Only 3 left in stock"
- **Access-limited**: "Exclusive to members"

**When to use:**

- Special promotions
- Limited releases
- Exclusive features

**Ethical implementation:**

- Use only when scarcity is genuine
- Avoid creating false urgency
- Don't pressure users into hasty decisions
- Provide clear, honest information

**Anti-patterns:**

- Fake countdown timers that reset
- Artificial stock limitations
- Manufactured exclusivity

---

## Performance and Quality

### Doherty Threshold

Response times under 400ms maintain user engagement; beyond this, interest deteriorates.

**Critical thresholds:**

- **<100ms**: Feels instantaneous
- **100-400ms**: Slight delay, but flow maintained
- **400ms-1s**: User notices delay
- **>1s**: User's attention begins to wander

**Implementation strategies:**

- Optimize critical path rendering
- Use optimistic UI updates
- Show loading indicators for >400ms operations
- Implement progressive loading
- Use skeleton screens for perceived performance
- Cache aggressively
- Defer non-critical operations

**Perceived performance techniques:**

- Animate elements while loading (gives sense of progress)
- Load above-the-fold content first
- Show partial results immediately
- Provide feedback within 100ms of user action

### Decision Fatigue

The quality of decisions deteriorates after making many decisions.

**When to consider:**

- Long forms
- Complex configuration flows
- Multi-step checkout processes

**Mitigation strategies:**

- Reduce number of choices at each step
- Provide smart defaults
- Save decisions for later
- Order decisions strategically (most important first)
- Group related decisions together
- Use progressive disclosure

**Implementation:**

- Break long forms into multiple pages
- Offer "Recommended settings" option
- Allow saving and resuming
- Minimize optional fields
- Use intelligent defaults based on user context

---

## Trust and Credibility

### Social Proof

People look to others' behavior to guide their own actions.

**Types:**

- **User numbers**: "Join 50,000+ users"
- **Testimonials**: Real user quotes
- **Ratings/reviews**: Star ratings and detailed feedback
- **Activity indicators**: "23 people viewing this now"
- **Expert endorsements**: Industry authority recommendations
- **Certifications**: Trust badges and security indicators

**When to use:**

- Landing pages
- Product pages
- Checkout flows
- Sign-up flows

**Best practices:**

- Use genuine, verifiable social proof
- Show recent activity (timestamps)
- Include specific details (not just numbers)
- Match social proof to user context

### Halo Effect

Positive impression in one area influences perception of other areas.

**Application in design:**

- Beautiful UI suggests reliable functionality
- Strong brand presence implies trustworthiness
- Attention to detail signals quality throughout

**Implementation:**

- Invest in visual polish
- Maintain consistency across touchpoints
- Highlight quality indicators
- Associate with trusted brands/certifications

### Aesthetic-Usability Effect

Users perceive attractive designs as more usable, even if they're not.

**Implications:**

- Visual design directly impacts perceived functionality
- Users are more tolerant of minor usability issues in beautiful interfaces
- First impressions heavily weight aesthetic quality

**Balance considerations:**

- Don't use aesthetics to mask poor usability
- Ensure actual usability matches aesthetic promise
- Invest in both beauty and function
- Test with real users, not just designers

---

## Implementation Priorities

When applying UX psychology principles, prioritize based on impact and context:

### High-Priority Universals

Apply to almost all interfaces:

1. **Progressive disclosure**: Prevent information overload
2. **Visual hierarchy**: Guide attention effectively
3. **Doherty threshold**: Optimize performance
4. **Peak-end rule**: Optimize critical moments
5. **Clear framing**: Use positive, action-oriented language

### Context-Dependent

Apply when relevant:

- **Gamification**: Learning, productivity, community platforms
- **Social proof**: E-commerce, SaaS landing pages, communities
- **Scarcity**: Promotions, limited releases (use ethically)
- **Variable rewards**: Social features, content discovery

### Use Sparingly

Powerful but easy to misuse:

- **Loss aversion**: Can feel manipulative if overused
- **Decoy effect**: Should feel natural, not forced
- **Scarcity effect**: Only when genuinely limited

### Ethical Considerations

Always prioritize:

- User autonomy and informed choice
- Transparent communication
- Genuine value delivery
- Long-term user well-being over short-term metrics
- Privacy and security

---

## Cross-Reference with UI Aesthetics

Combine UX psychology with UI aesthetics for maximum impact:

- **Cognitive load** + **Visual hierarchy**: Use typography scale and color to guide attention
- **Peak-end rule** + **Motion design**: Create memorable moments with well-crafted animations
- **Progressive disclosure** + **Spatial design**: Use depth and layering to reveal information
- **Social proof** + **Typography**: Make testimonials visually compelling
- **Aesthetic-usability effect** + **Color & theme**: Beautiful palettes improve perceived functionality

For detailed UI aesthetic guidelines, see `ui-aesthetics.md`.
