import React, { useState } from "react";
import { Bell, Briefcase, Check, ChevronRight, Mail, Menu, Search, Shield, User } from "lucide-react";

// Import from our centralized design system
import {
  ModernButton,
  ModernSwitch,
  LoadingSpinner,
  LoadingOverlay,
  PageTransition,
  FadeIn,
  StaggeredFadeIn,
  AnimatedTabs,
  AnimatedTabsContent,
  AnimatedTabsList,
  AnimatedTabsTrigger,
  Section,
  Grid,
  Text,
  ModernCard,
  IconContainer,
  Divider,
  Badge
} from "@/components/ui/design-system";

export default function DesignSystemDemo() {
  const [tab, setTab] = useState("typography");
  const [isLoading, setIsLoading] = useState(false);
  const [switchState, setSwitchState] = useState(false);

  // Demo loading state for 2 seconds when button is clicked
  const handleLoadingClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <PageTransition mode="fade">
      <div className="min-h-screen bg-neutral-50 p-6 md:p-12">
        <FadeIn className="max-w-5xl mx-auto">
          <header className="mb-12">
            <Text variant="h1" weight="bold" className="mb-3">Wugweb Team Design System</Text>
            <Text variant="lead" color="muted">A comprehensive collection of UI components with consistent styling</Text>
          </header>

          <main>
            <div className="mb-10">
              <AnimatedTabs value={tab} onValueChange={setTab}>
                <AnimatedTabsList className="mb-8">
                  <AnimatedTabsTrigger value="typography">Typography</AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="buttons">Buttons</AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="inputs">Inputs</AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="cards">Cards</AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="loaders">Loaders</AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="layout">Layout</AnimatedTabsTrigger>
                </AnimatedTabsList>

                {/* Typography */}
                <AnimatedTabsContent value="typography">
                  <Section spacing="lg">
                    <Text variant="h2" weight="semibold">Typography</Text>
                    
                    <div className="space-y-4">
                      <Text variant="h1" weight="bold">Heading 1</Text>
                      <Text variant="h2" weight="semibold">Heading 2</Text>
                      <Text variant="h3" weight="medium">Heading 3</Text>
                      <Text variant="h4">Heading 4</Text>
                      <Text variant="h5">Heading 5</Text>
                      <Text variant="lead">Lead text is larger than body text and is used for introductory paragraphs.</Text>
                      <Text variant="body">Body text is the default text style used for most content.</Text>
                      <Text variant="body-sm">Small body text is used for less important content.</Text>
                      <Text variant="caption">Caption text is the smallest text style, used for captions and annotations.</Text>
                      <Text variant="overline">OVERLINE TEXT FOR CATEGORIES</Text>
                    </div>

                    <div className="space-y-4">
                      <Text variant="h3" weight="semibold" className="mb-2">Text Colors</Text>
                      <Text color="default">Default Text Color</Text>
                      <Text color="muted">Muted Text Color</Text>
                      <Text color="primary">Primary Text Color</Text>
                      <Text color="black">Black Text Color</Text>
                      <div className="bg-black p-4 rounded-md">
                        <Text color="white">White Text Color</Text>
                      </div>
                    </div>

                    <div className="space-y-2 mt-6">
                      <Text variant="h3" weight="semibold" className="mb-4">Badges</Text>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="error">Error</Badge>
                      </div>
                    </div>
                  </Section>
                </AnimatedTabsContent>

                {/* Buttons */}
                <AnimatedTabsContent value="buttons">
                  <Section spacing="lg">
                    <Text variant="h2" weight="semibold">Buttons</Text>
                    
                    <div className="space-y-8">
                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Button Variants</Text>
                        <div className="flex flex-wrap gap-4">
                          <ModernButton variant="primary">Primary</ModernButton>
                          <ModernButton variant="secondary">Secondary</ModernButton>
                          <ModernButton variant="outline">Outline</ModernButton>
                          <ModernButton variant="ghost">Ghost</ModernButton>
                          <ModernButton variant="link">Link</ModernButton>
                          <ModernButton variant="subtle">Subtle</ModernButton>
                          <ModernButton variant="black">Black</ModernButton>
                        </div>
                      </div>

                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Button Sizes</Text>
                        <div className="flex flex-wrap items-center gap-4">
                          <ModernButton size="sm" variant="primary">Small</ModernButton>
                          <ModernButton size="md" variant="primary">Medium</ModernButton>
                          <ModernButton size="lg" variant="primary">Large</ModernButton>
                          <ModernButton size="xl" variant="primary">X-Large</ModernButton>
                          <ModernButton size="icon" variant="outline">
                            <Search className="h-4 w-4" />
                          </ModernButton>
                        </div>
                      </div>

                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Button States</Text>
                        <div className="flex flex-wrap gap-4">
                          <ModernButton variant="primary" isLoading>Loading</ModernButton>
                          <ModernButton variant="primary" disabled>Disabled</ModernButton>
                          <ModernButton variant="primary" isActive>Active</ModernButton>
                        </div>
                      </div>

                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Button with Icons</Text>
                        <div className="flex flex-wrap gap-4">
                          <ModernButton variant="primary" leftIcon={<Mail className="h-4 w-4" />}>
                            Email
                          </ModernButton>
                          <ModernButton variant="secondary" rightIcon={<ChevronRight className="h-4 w-4" />}>
                            Next
                          </ModernButton>
                          <ModernButton variant="outline" leftIcon={<Check className="h-4 w-4" />} rightIcon={<ChevronRight className="h-4 w-4" />}>
                            Complete
                          </ModernButton>
                        </div>
                      </div>
                    </div>
                  </Section>
                </AnimatedTabsContent>

                {/* Inputs */}
                <AnimatedTabsContent value="inputs">
                  <Section spacing="lg">
                    <Text variant="h2" weight="semibold">Form Inputs</Text>
                    
                    <div className="space-y-8">
                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Switches</Text>
                        <div className="space-y-4">
                          <ModernSwitch 
                            label="Notifications" 
                            description="Receive email notifications when there are new updates"
                            isChecked={switchState}
                            onChange={setSwitchState}
                          />
                          
                          <div className="flex flex-wrap gap-8">
                            <ModernSwitch 
                              label="Small Switch" 
                              size="sm"
                              isChecked={true}
                            />
                            <ModernSwitch 
                              label="Medium Switch" 
                              size="md"
                              isChecked={true}
                            />
                            <ModernSwitch 
                              label="Large Switch" 
                              size="lg"
                              isChecked={true}
                            />
                          </div>
                          
                          <div className="flex flex-wrap gap-8">
                            <ModernSwitch 
                              label="Default Color" 
                              color="default"
                              isChecked={true}
                            />
                            <ModernSwitch 
                              label="Yellow Color" 
                              color="yellow"
                              isChecked={true}
                            />
                            <ModernSwitch 
                              label="Black Color" 
                              color="black"
                              isChecked={true}
                            />
                          </div>
                          
                          <ModernSwitch 
                            label="Disabled Switch" 
                            disabled
                            isChecked={false}
                          />
                        </div>
                      </div>
                    </div>
                  </Section>
                </AnimatedTabsContent>

                {/* Cards */}
                <AnimatedTabsContent value="cards">
                  <Section spacing="lg">
                    <Text variant="h2" weight="semibold">Cards</Text>
                    
                    <Grid cols={3} gap="lg">
                      <ModernCard className="p-6">
                        <IconContainer size="lg" color="primary" className="mb-4 bg-yellow-100 p-2 rounded-md">
                          <Shield className="h-6 w-6" />
                        </IconContainer>
                        <Text variant="h4" weight="semibold" className="mb-2">Default Card</Text>
                        <Text variant="body" color="muted">This is a default card with a shadow and border.</Text>
                      </ModernCard>
                      
                      <ModernCard variant="outline" className="p-6">
                        <IconContainer size="lg" color="primary" className="mb-4 bg-yellow-100 p-2 rounded-md">
                          <Mail className="h-6 w-6" />
                        </IconContainer>
                        <Text variant="h4" weight="semibold" className="mb-2">Outline Card</Text>
                        <Text variant="body" color="muted">This card has a border but no shadow.</Text>
                      </ModernCard>
                      
                      <ModernCard variant="ghost" className="p-6">
                        <IconContainer size="lg" color="primary" className="mb-4 bg-yellow-100 p-2 rounded-md">
                          <User className="h-6 w-6" />
                        </IconContainer>
                        <Text variant="h4" weight="semibold" className="mb-2">Ghost Card</Text>
                        <Text variant="body" color="muted">This card has no border or shadow.</Text>
                      </ModernCard>
                      
                      <ModernCard className="p-6" interactive>
                        <IconContainer size="lg" color="primary" className="mb-4 bg-yellow-100 p-2 rounded-md">
                          <Briefcase className="h-6 w-6" />
                        </IconContainer>
                        <Text variant="h4" weight="semibold" className="mb-2">Interactive Card</Text>
                        <Text variant="body" color="muted">This card has hover effects. Try hovering over it!</Text>
                      </ModernCard>

                      <ModernCard className="p-0 overflow-hidden" interactive>
                        <div className="h-40 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                        <div className="p-6">
                          <Text variant="h4" weight="semibold" className="mb-2">Card with Media</Text>
                          <Text variant="body" color="muted">A card with a header image gradient.</Text>
                        </div>
                      </ModernCard>

                      <ModernCard className="p-6">
                        <Text variant="h4" weight="semibold" className="mb-2">Card with Divider</Text>
                        <Text variant="body" color="muted" className="mb-4">This card contains a horizontal divider element.</Text>
                        <Divider className="my-4" />
                        <Text variant="body" color="muted">Content below the divider.</Text>
                      </ModernCard>
                    </Grid>
                  </Section>
                </AnimatedTabsContent>

                {/* Loaders */}
                <AnimatedTabsContent value="loaders">
                  <Section spacing="lg">
                    <Text variant="h2" weight="semibold">Loaders</Text>
                    
                    <div className="space-y-8">
                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Loading Spinners</Text>
                        <div className="flex flex-wrap gap-8 items-center">
                          <LoadingSpinner size="xs" />
                          <LoadingSpinner size="sm" />
                          <LoadingSpinner size="md" />
                          <LoadingSpinner size="lg" />
                          <LoadingSpinner size="xl" />
                        </div>
                      </div>

                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Spinner Colors</Text>
                        <div className="flex flex-wrap gap-8 items-center">
                          <LoadingSpinner color="default" />
                          <LoadingSpinner color="yellow" />
                          <div className="p-4 bg-black rounded-md">
                            <LoadingSpinner color="white" />
                          </div>
                          <LoadingSpinner color="black" />
                        </div>
                      </div>

                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Loading Overlay</Text>
                        <div className="space-y-4">
                          <ModernButton variant="primary" onClick={handleLoadingClick}>
                            Show Loading Overlay
                          </ModernButton>
                          
                          <LoadingOverlay isLoading={isLoading} text="Loading content...">
                            <ModernCard className="p-6 h-64">
                              <Text variant="h4" weight="semibold" className="mb-2">Card with Loading Overlay</Text>
                              <Text variant="body" color="muted">This card demonstrates how the loading overlay works.</Text>
                            </ModernCard>
                          </LoadingOverlay>
                        </div>
                      </div>
                    </div>
                  </Section>
                </AnimatedTabsContent>

                {/* Layout */}
                <AnimatedTabsContent value="layout">
                  <Section spacing="lg">
                    <Text variant="h2" weight="semibold">Layout Components</Text>
                    
                    <div className="space-y-8">
                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Section Component</Text>
                        <Section spacing="md" className="border border-neutral-200 p-4 rounded-md">
                          <Text variant="h4">Section with Medium Spacing</Text>
                          <Text variant="body">Sections help organize content with consistent spacing.</Text>
                          <Text variant="body">This section has medium spacing between elements.</Text>
                        </Section>
                      </div>

                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Grid Component</Text>
                        <div className="space-y-6">
                          <div>
                            <Text variant="h5" weight="medium" className="mb-2">1 Column Grid</Text>
                            <Grid cols={1} gap="md">
                              <div className="bg-yellow-100 p-4 rounded-md">Column 1</div>
                            </Grid>
                          </div>
                          
                          <div>
                            <Text variant="h5" weight="medium" className="mb-2">2 Column Grid</Text>
                            <Grid cols={2} gap="md">
                              <div className="bg-yellow-100 p-4 rounded-md">Column 1</div>
                              <div className="bg-yellow-100 p-4 rounded-md">Column 2</div>
                            </Grid>
                          </div>
                          
                          <div>
                            <Text variant="h5" weight="medium" className="mb-2">3 Column Grid</Text>
                            <Grid cols={3} gap="md">
                              <div className="bg-yellow-100 p-4 rounded-md">Column 1</div>
                              <div className="bg-yellow-100 p-4 rounded-md">Column 2</div>
                              <div className="bg-yellow-100 p-4 rounded-md">Column 3</div>
                            </Grid>
                          </div>
                          
                          <div>
                            <Text variant="h5" weight="medium" className="mb-2">4 Column Grid</Text>
                            <Grid cols={4} gap="md">
                              <div className="bg-yellow-100 p-4 rounded-md">Column 1</div>
                              <div className="bg-yellow-100 p-4 rounded-md">Column 2</div>
                              <div className="bg-yellow-100 p-4 rounded-md">Column 3</div>
                              <div className="bg-yellow-100 p-4 rounded-md">Column 4</div>
                            </Grid>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Text variant="h3" weight="medium" className="mb-4">Icon Container</Text>
                        <div className="flex flex-wrap gap-8 items-center">
                          <IconContainer size="sm" color="primary">
                            <Bell className="h-4 w-4" />
                          </IconContainer>
                          <IconContainer size="md" color="primary">
                            <Bell className="h-5 w-5" />
                          </IconContainer>
                          <IconContainer size="lg" color="primary">
                            <Bell className="h-6 w-6" />
                          </IconContainer>
                          <IconContainer size="xl" color="primary">
                            <Bell className="h-8 w-8" />
                          </IconContainer>
                        </div>
                        
                        <div className="flex flex-wrap gap-8 items-center mt-4">
                          <IconContainer color="default">
                            <Menu className="h-5 w-5" />
                          </IconContainer>
                          <IconContainer color="muted">
                            <Menu className="h-5 w-5" />
                          </IconContainer>
                          <IconContainer color="primary">
                            <Menu className="h-5 w-5" />
                          </IconContainer>
                          <IconContainer color="black">
                            <Menu className="h-5 w-5" />
                          </IconContainer>
                          <div className="bg-black p-2 rounded-md">
                            <IconContainer color="white">
                              <Menu className="h-5 w-5" />
                            </IconContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Section>
                </AnimatedTabsContent>
              </AnimatedTabs>
            </div>
          </main>
        </FadeIn>
      </div>
    </PageTransition>
  );
}