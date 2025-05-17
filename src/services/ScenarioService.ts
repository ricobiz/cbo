
import { Scenario, ScenarioFilter, ScenarioStatus, ScenarioStep, ScenarioTemplate, ScenarioCategory } from "./types/scenario";

/**
 * Service for Scenario Management
 */
export class ScenarioService {
  private static STORAGE_KEY = 'scenarios';
  private static TEMPLATES_STORAGE_KEY = 'scenarioTemplates';

  /**
   * Get all scenarios from storage
   */
  static getAllScenarios(): Scenario[] {
    try {
      const scenarios = localStorage.getItem(this.STORAGE_KEY);
      return scenarios ? JSON.parse(scenarios) : this.generateDemoScenarios();
    } catch (error) {
      console.error("Error retrieving scenarios:", error);
      return this.generateDemoScenarios();
    }
  }

  /**
   * Get a scenario by ID
   */
  static getScenarioById(id: string): Scenario | undefined {
    const scenarios = this.getAllScenarios();
    return scenarios.find(scenario => scenario.id === id);
  }

  /**
   * Filter scenarios based on criteria
   */
  static filterScenarios(filters: ScenarioFilter): Scenario[] {
    let scenarios = this.getAllScenarios();
    
    // Apply filters
    if (filters.status && filters.status.length > 0) {
      scenarios = scenarios.filter(scenario => filters.status!.includes(scenario.status));
    }
    
    if (filters.category && filters.category.length > 0) {
      scenarios = scenarios.filter(scenario => filters.category!.includes(scenario.category));
    }
    
    if (filters.platform && filters.platform.length > 0) {
      scenarios = scenarios.filter(scenario => 
        scenario.platforms.some(platform => filters.platform!.includes(platform))
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      scenarios = scenarios.filter(scenario => 
        filters.tags!.some(tag => scenario.tags.includes(tag))
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      scenarios = scenarios.filter(scenario => 
        scenario.name.toLowerCase().includes(searchLower) || 
        (scenario.description && scenario.description.toLowerCase().includes(searchLower))
      );
    }
    
    return scenarios;
  }

  /**
   * Save a scenario
   */
  static saveScenario(scenario: Scenario): Scenario {
    const scenarios = this.getAllScenarios();
    const existingIndex = scenarios.findIndex(s => s.id === scenario.id);
    
    if (existingIndex >= 0) {
      // Update existing scenario
      scenarios[existingIndex] = {
        ...scenario,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new scenario
      scenarios.push({
        ...scenario,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scenarios));
    return scenario;
  }

  /**
   * Delete a scenario
   */
  static deleteScenario(id: string): boolean {
    const scenarios = this.getAllScenarios();
    const filteredScenarios = scenarios.filter(scenario => scenario.id !== id);
    
    if (filteredScenarios.length < scenarios.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredScenarios));
      return true;
    }
    
    return false;
  }

  /**
   * Update scenario status
   */
  static updateScenarioStatus(id: string, status: ScenarioStatus): Scenario | undefined {
    const scenario = this.getScenarioById(id);
    
    if (scenario) {
      const updatedScenario = {
        ...scenario,
        status,
        updatedAt: new Date().toISOString()
      };
      
      this.saveScenario(updatedScenario);
      return updatedScenario;
    }
    
    return undefined;
  }

  /**
   * Update step status
   */
  static updateStepStatus(scenarioId: string, stepId: string, status: ScenarioStep['status'], results?: Record<string, any>): Scenario | undefined {
    const scenario = this.getScenarioById(scenarioId);
    
    if (scenario) {
      const updatedSteps = scenario.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            status,
            results: results || step.results
          };
        }
        return step;
      });
      
      const updatedScenario = {
        ...scenario,
        steps: updatedSteps,
        updatedAt: new Date().toISOString()
      };
      
      this.saveScenario(updatedScenario);
      return updatedScenario;
    }
    
    return undefined;
  }

  /**
   * Get all scenario templates
   */
  static getAllScenarioTemplates(): ScenarioTemplate[] {
    try {
      const templates = localStorage.getItem(this.TEMPLATES_STORAGE_KEY);
      return templates ? JSON.parse(templates) : this.generateDemoTemplates();
    } catch (error) {
      console.error("Error retrieving scenario templates:", error);
      return this.generateDemoTemplates();
    }
  }

  /**
   * Create scenario from template
   */
  static createScenarioFromTemplate(templateId: string, name: string, description: string): Scenario | undefined {
    const templates = this.getAllScenarioTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) return undefined;
    
    // Create steps with generated IDs
    const steps = template.steps.map(step => ({
      ...step,
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      status: 'pending' as const,
    }));
    
    const scenario: Scenario = {
      id: Date.now().toString(),
      name,
      description,
      status: 'draft',
      category: template.category,
      steps,
      variables: [],
      triggers: [{ type: 'manual', config: {}, active: true }],
      permissions: [{ user: 'admin', access: 'admin' }],
      platforms: template.platforms,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    };
    
    return this.saveScenario(scenario);
  }

  /**
   * Generate demo scenarios for first-time use
   */
  private static generateDemoScenarios(): Scenario[] {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const demoScenarios: Scenario[] = [
      {
        id: '1',
        name: 'YouTube Trend Launch',
        description: 'Автоматический запуск тренда для нового видео на YouTube с использованием ботов просмотра и взаимодействия.',
        status: 'running',
        category: 'growth',
        steps: [
          {
            id: '101',
            name: 'Генерация комментариев',
            type: 'content-generation',
            status: 'completed',
            config: {
              contentType: 'youtube-comments',
              count: 20,
              tone: 'positive',
              keywords: ['круто', 'интересно', 'подписался']
            },
            results: {
              generatedComments: 20,
              status: 'success'
            }
          },
          {
            id: '102',
            name: 'Запуск ботов просмотра',
            type: 'bot-action',
            status: 'in-progress',
            config: {
              botType: 'view',
              targetUrl: 'https://www.youtube.com/watch?v=example',
              count: 1000,
              speed: 'medium'
            }
          },
          {
            id: '103',
            name: 'Публикация комментариев',
            type: 'bot-action',
            status: 'pending',
            config: {
              botType: 'interaction',
              action: 'comment',
              targetUrl: 'https://www.youtube.com/watch?v=example',
              useGeneratedContent: true,
              contentStepId: '101'
            },
            dependsOn: ['101', '102']
          }
        ],
        variables: [
          {
            name: 'targetViews',
            type: 'number',
            value: 10000,
            description: 'Целевое количество просмотров'
          },
          {
            name: 'videoUrl',
            type: 'string',
            value: 'https://www.youtube.com/watch?v=example',
            description: 'URL целевого видео'
          }
        ],
        triggers: [
          {
            type: 'manual',
            config: {},
            active: true
          },
          {
            type: 'scheduled',
            config: {
              startDate: now.toISOString(),
              endDate: nextWeek.toISOString(),
              repeatEvery: 86400 // 1 day in seconds
            },
            active: false
          }
        ],
        permissions: [
          {
            user: 'admin',
            access: 'admin'
          }
        ],
        platforms: ['youtube'],
        botTypes: ['view', 'interaction'],
        createdBy: 'admin',
        createdAt: yesterday.toISOString(),
        updatedAt: now.toISOString(),
        lastRun: now.toISOString(),
        tags: ['youtube', 'trend', 'views']
      },
      {
        id: '2',
        name: 'Instagram Engagement Boost',
        description: 'Повышение активности в профиле Instagram через комментарии, лайки и подписки с использованием ботов взаимодействия.',
        status: 'draft',
        category: 'engagement',
        steps: [
          {
            id: '201',
            name: 'Сбор целевой аудитории',
            type: 'bot-action',
            status: 'pending',
            config: {
              botType: 'parser',
              targetAccounts: ['competitor1', 'competitor2', 'competitor3'],
              extractFollowers: true,
              minFollowers: 100,
              maxFollowers: 5000,
              limit: 1000
            }
          },
          {
            id: '202',
            name: 'Генерация комментариев и лайков',
            type: 'bot-action',
            status: 'pending',
            config: {
              botType: 'interaction',
              actions: ['like', 'comment', 'follow'],
              distribution: {
                like: 0.7,
                comment: 0.3,
                follow: 0.2
              },
              speed: 'safe'
            },
            dependsOn: ['201']
          },
          {
            id: '203',
            name: 'Анализ результатов',
            type: 'notification',
            status: 'pending',
            config: {
              notifyType: 'email',
              metrics: ['engagement', 'followers', 'reach']
            },
            dependsOn: ['202']
          }
        ],
        variables: [],
        triggers: [
          {
            type: 'manual',
            config: {},
            active: true
          }
        ],
        permissions: [
          {
            user: 'admin',
            access: 'admin'
          }
        ],
        platforms: ['instagram'],
        botTypes: ['parser', 'interaction'],
        createdBy: 'admin',
        createdAt: yesterday.toISOString(),
        updatedAt: yesterday.toISOString(),
        tags: ['instagram', 'engagement']
      }
    ];
    
    return demoScenarios;
  }

  /**
   * Generate demo templates for first-time use
   */
  private static generateDemoTemplates(): ScenarioTemplate[] {
    const templates: ScenarioTemplate[] = [
      {
        id: 'template-1',
        name: 'YouTube View Booster',
        description: 'Increase views and engagement on YouTube videos automatically',
        category: 'growth',
        platforms: ['youtube'],
        previewImage: 'https://placehold.co/400x200/e74c3c/ffffff?text=YouTube+Booster',
        complexity: 'simple',
        estimatedDuration: '2-3 days',
        steps: [
          {
            name: 'Generate Comments',
            type: 'content-generation',
            config: {
              contentType: 'youtube-comments',
              count: 20,
              tone: 'positive'
            }
          },
          {
            name: 'Run View Bots',
            type: 'bot-action',
            config: {
              botType: 'view',
              count: 1000,
              speed: 'medium'
            }
          },
          {
            name: 'Post Comments',
            type: 'bot-action',
            config: {
              botType: 'interaction',
              action: 'comment',
              useGeneratedContent: true,
              contentStepId: '{{stepId:Generate Comments}}'
            },
            dependsOn: ['{{stepId:Generate Comments}}', '{{stepId:Run View Bots}}']
          }
        ]
      },
      {
        id: 'template-2',
        name: 'Instagram Growth Campaign',
        description: 'Grow your Instagram following with targeted interactions',
        category: 'engagement',
        platforms: ['instagram'],
        previewImage: 'https://placehold.co/400x200/3498db/ffffff?text=Instagram+Growth',
        complexity: 'medium',
        estimatedDuration: '1-2 weeks',
        steps: [
          {
            name: 'Collect Target Audience',
            type: 'bot-action',
            config: {
              botType: 'parser',
              extractFollowers: true,
              minFollowers: 100,
              maxFollowers: 5000
            }
          },
          {
            name: 'Engagement Actions',
            type: 'bot-action',
            config: {
              botType: 'interaction',
              actions: ['like', 'comment', 'follow'],
              distribution: {
                like: 0.7,
                comment: 0.3,
                follow: 0.2
              }
            },
            dependsOn: ['{{stepId:Collect Target Audience}}']
          }
        ]
      },
      {
        id: 'template-3',
        name: 'Spotify Track Promoter',
        description: 'Boost your music with streaming and playlist promotion',
        category: 'growth',
        platforms: ['spotify'],
        previewImage: 'https://placehold.co/400x200/1db954/ffffff?text=Spotify+Promoter',
        complexity: 'advanced',
        estimatedDuration: '2-4 weeks',
        steps: [
          {
            name: 'Setup Stream Bots',
            type: 'bot-action',
            config: {
              botType: 'view',
              platform: 'spotify',
              streamDuration: {
                min: 120,
                max: 240
              }
            }
          },
          {
            name: 'Playlist Submission',
            type: 'bot-action',
            config: {
              botType: 'interaction',
              action: 'submit',
              targetType: 'playlists',
              criteria: {
                minFollowers: 1000,
                genres: ['indie', 'pop', 'electronic']
              }
            }
          },
          {
            name: 'Results Analysis',
            type: 'notification',
            config: {
              notifyType: 'dashboard',
              metrics: ['streams', 'saves', 'playlist_adds']
            },
            dependsOn: ['{{stepId:Setup Stream Bots}}', '{{stepId:Playlist Submission}}']
          }
        ]
      }
    ];
    
    return templates;
  }
}
