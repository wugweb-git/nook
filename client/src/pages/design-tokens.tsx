import React from 'react';
import Layout from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Import token styles
import '@/styles/tokens/index.css';

export default function DesignTokens() {
  return (
    <Layout title="Design Tokens">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Design Tokens</h1>
          <p className="text-muted-foreground">
            A comprehensive collection of design variables used throughout the application
          </p>
        </div>

        <Tabs defaultValue="colors">
          <TabsList className="mb-8">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="shadows">Shadows</TabsTrigger>
          </TabsList>

          {/* Colors */}
          <TabsContent value="colors">
            <h2 className="text-2xl font-bold mb-4">Colors</h2>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Primary Colors</CardTitle>
                <CardDescription>Primary brand colors used across the application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
                    <div key={`primary-${weight}`} className="flex flex-col items-center">
                      <div 
                        className="w-16 h-16 rounded-md mb-2 shadow-md" 
                        style={{ backgroundColor: `var(--color-primary-${weight})` }}
                      />
                      <div className="text-sm font-medium">{weight}</div>
                      <div className="text-xs text-muted-foreground">Primary {weight}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Gray Scale</CardTitle>
                <CardDescription>Neutral colors used for text, backgrounds, and borders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
                    <div key={`gray-${weight}`} className="flex flex-col items-center">
                      <div 
                        className="w-16 h-16 rounded-md mb-2 shadow-md" 
                        style={{ backgroundColor: `var(--color-gray-${weight})` }}
                      />
                      <div className="text-sm font-medium">{weight}</div>
                      <div className="text-xs text-muted-foreground">Gray {weight}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Semantic Colors</CardTitle>
                <CardDescription>Success, warning, and error colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['success', 'warning', 'destructive'].map((type) => (
                    <div key={`${type}-500`} className="flex flex-col items-center">
                      <div 
                        className="w-16 h-16 rounded-md mb-2 shadow-md" 
                        style={{ backgroundColor: `var(--color-${type}-500)` }}
                      />
                      <div className="text-sm font-medium capitalize">{type}</div>
                      <div className="text-xs text-muted-foreground">{type}-500</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>UI Colors</CardTitle>
                <CardDescription>Colors used for specific UI components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: 'Background', token: 'var(--background)' },
                    { name: 'Foreground', token: 'var(--foreground)' },
                    { name: 'Card', token: 'var(--card)' },
                    { name: 'Card Foreground', token: 'var(--card-foreground)' },
                    { name: 'Popover', token: 'var(--popover)' },
                    { name: 'Popover Foreground', token: 'var(--popover-foreground)' },
                    { name: 'Primary', token: 'var(--primary)' },
                    { name: 'Primary Foreground', token: 'var(--primary-foreground)' },
                    { name: 'Secondary', token: 'var(--secondary)' },
                    { name: 'Secondary Foreground', token: 'var(--secondary-foreground)' },
                    { name: 'Muted', token: 'var(--muted)' },
                    { name: 'Muted Foreground', token: 'var(--muted-foreground)' },
                    { name: 'Accent', token: 'var(--accent)' },
                    { name: 'Accent Foreground', token: 'var(--accent-foreground)' },
                    { name: 'Border', token: 'var(--border)' },
                    { name: 'Input', token: 'var(--input)' },
                  ].map((color) => (
                    <div key={color.name} className="flex flex-col">
                      <div 
                        className="h-12 rounded-md mb-2 shadow-md" 
                        style={{ backgroundColor: color.token }}
                      />
                      <div className="text-sm font-medium">{color.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography">
            <h2 className="text-2xl font-bold mb-4">Typography</h2>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Headings</CardTitle>
                <CardDescription>Text styles for different heading levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold">Heading 1</h1>
                  <p className="text-sm text-muted-foreground mt-1">--text-h1 (2.25rem / 36px)</p>
                </div>
                <Separator />
                <div>
                  <h2 className="text-3xl font-bold">Heading 2</h2>
                  <p className="text-sm text-muted-foreground mt-1">--text-h2 (1.875rem / 30px)</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-2xl font-bold">Heading 3</h3>
                  <p className="text-sm text-muted-foreground mt-1">--text-h3 (1.5rem / 24px)</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xl font-semibold">Heading 4</h4>
                  <p className="text-sm text-muted-foreground mt-1">--text-h4 (1.25rem / 20px)</p>
                </div>
                <Separator />
                <div>
                  <h5 className="text-lg font-semibold">Heading 5</h5>
                  <p className="text-sm text-muted-foreground mt-1">--text-h5 (1.125rem / 18px)</p>
                </div>
                <Separator />
                <div>
                  <h6 className="text-base font-semibold">Heading 6</h6>
                  <p className="text-sm text-muted-foreground mt-1">--text-h6 (1rem / 16px)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Body Text</CardTitle>
                <CardDescription>Text styles for content and paragraphs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-lg">Body Large</p>
                  <p className="text-sm text-muted-foreground mt-1">--text-body-lg (1.125rem / 18px)</p>
                </div>
                <Separator />
                <div>
                  <p>Body Regular</p>
                  <p className="text-sm text-muted-foreground mt-1">--text-body (1rem / 16px)</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm">Body Small</p>
                  <p className="text-sm text-muted-foreground mt-1">--text-body-sm (0.875rem / 14px)</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs">Body Extra Small</p>
                  <p className="text-sm text-muted-foreground mt-1">--text-body-xs (0.75rem / 12px)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Font Weights</CardTitle>
                <CardDescription>Available font weight variations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Thin', weight: '100' },
                  { name: 'Extra Light', weight: '200' },
                  { name: 'Light', weight: '300' },
                  { name: 'Regular', weight: '400' },
                  { name: 'Medium', weight: '500' },
                  { name: 'Semi Bold', weight: '600' },
                  { name: 'Bold', weight: '700' },
                  { name: 'Extra Bold', weight: '800' },
                  { name: 'Black', weight: '900' },
                ].map((font, index) => (
                  <React.Fragment key={font.weight}>
                    {index > 0 && <Separator />}
                    <div>
                      <p style={{ fontWeight: font.weight }}>
                        {font.name} ({font.weight})
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">--font-weight-{font.name.toLowerCase().replace(' ', '')}</p>
                    </div>
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spacing */}
          <TabsContent value="spacing">
            <h2 className="text-2xl font-bold mb-4">Spacing</h2>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Spacing Scale</CardTitle>
                <CardDescription>Base unit: 0.25rem (4px)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    [0, 1, 2, 3, 4],
                    [5, 6, 8, 10, 12],
                    [14, 16, 20, 24, 32],
                    [40, 48, 64, 80, 96]
                  ].map((group, groupIndex) => (
                    <div key={groupIndex} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {group.map((size) => (
                        <div key={`spacing-${size}`} className="flex flex-col items-start">
                          <div 
                            className="bg-primary h-4 mb-2 rounded" 
                            style={{ width: `var(--spacing-${size})` }}
                          />
                          <div className="text-sm font-medium">{size}</div>
                          <div className="text-xs text-muted-foreground">
                            {`${size * 4}px`} ({`${size * 0.25}rem`})
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Component Spacing</CardTitle>
                <CardDescription>Specific spacing values for components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { name: 'Container Padding', token: '--spacing-container-padding' },
                    { name: 'Section Gap', token: '--spacing-section-gap' },
                    { name: 'Card Padding', token: '--spacing-card-padding' },
                    { name: 'Form Gap', token: '--spacing-form-gap' },
                    { name: 'Button Padding X', token: '--spacing-button-padding-x' },
                    { name: 'Button Padding Y', token: '--spacing-button-padding-y' },
                    { name: 'Sidebar Item Gap', token: '--spacing-sidebar-item-gap' },
                    { name: 'Modal Padding', token: '--spacing-modal-padding' }
                  ].map((spacing) => (
                    <div key={spacing.name} className="flex flex-row items-center gap-4">
                      <div 
                        className="bg-primary h-6 rounded" 
                        style={{ width: `var(${spacing.token})` }}
                      />
                      <div>
                        <div className="text-sm font-medium">{spacing.name}</div>
                        <div className="text-xs text-muted-foreground">{spacing.token}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shadows */}
          <TabsContent value="shadows">
            <h2 className="text-2xl font-bold mb-4">Shadows</h2>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Box Shadows</CardTitle>
                <CardDescription>Standard shadow depths for elements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {[
                    { name: 'Shadow SM', token: '--shadow-sm' },
                    { name: 'Shadow', token: '--shadow' },
                    { name: 'Shadow MD', token: '--shadow-md' },
                    { name: 'Shadow LG', token: '--shadow-lg' },
                    { name: 'Shadow XL', token: '--shadow-xl' },
                    { name: 'Shadow 2XL', token: '--shadow-2xl' },
                    { name: 'Shadow Inner', token: '--shadow-inner' }
                  ].map((shadow) => (
                    <div key={shadow.name} className="flex flex-col">
                      <div 
                        className="h-24 rounded-lg bg-card mb-4 border" 
                        style={{ boxShadow: `var(${shadow.token})` }}
                      />
                      <div className="text-sm font-medium">{shadow.name}</div>
                      <div className="text-xs text-muted-foreground">{shadow.token}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Component Shadows</CardTitle>
                <CardDescription>Specific shadows for UI components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {[
                    { name: 'Card', token: '--shadow-card' },
                    { name: 'Dropdown', token: '--shadow-dropdown' },
                    { name: 'Sidebar', token: '--shadow-sidebar' },
                    { name: 'Modal', token: '--shadow-modal' },
                    { name: 'Popover', token: '--shadow-popover' },
                    { name: 'Toast', token: '--shadow-toast' }
                  ].map((shadow) => (
                    <div key={shadow.name} className="flex flex-col">
                      <div 
                        className="h-24 rounded-lg bg-card mb-4 border" 
                        style={{ boxShadow: `var(${shadow.token})` }}
                      />
                      <div className="text-sm font-medium">{shadow.name}</div>
                      <div className="text-xs text-muted-foreground">{shadow.token}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Colored Shadows</CardTitle>
                <CardDescription>Shadows with color tints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { name: 'Primary', token: '--shadow-primary' },
                    { name: 'Success', token: '--shadow-success' },
                    { name: 'Warning', token: '--shadow-warning' },
                    { name: 'Destructive', token: '--shadow-destructive' }
                  ].map((shadow) => (
                    <div key={shadow.name} className="flex flex-col">
                      <div 
                        className="h-24 rounded-lg bg-card mb-4 border" 
                        style={{ boxShadow: `var(${shadow.token})` }}
                      />
                      <div className="text-sm font-medium">{shadow.name}</div>
                      <div className="text-xs text-muted-foreground">{shadow.token}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}