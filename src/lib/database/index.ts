import { promises as fs } from 'fs';
import path from 'path';
import { dbConfig, User, Post, Category, SiteSettings } from './models';

export { dbConfig };

// Simple file-based database implementation
// In production, replace this with a real database connection

class Database {
  private dataDir: string;

  constructor() {
    this.dataDir = dbConfig.dataDir;
    this.ensureDataDir();
  }

  private async ensureDataDir() {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  private async readCollection<T>(collection: string): Promise<T[]> {
    try {
      const filePath = path.join(this.dataDir, collection);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async writeCollection<T>(collection: string, data: T[]): Promise<void> {
    const filePath = path.join(this.dataDir, collection);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  // Generic CRUD operations
  async create<T extends { id: string; createdAt: string; updatedAt: string }>(collection: string, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const items = await this.readCollection<T>(collection);
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as T;
    
    items.push(newItem);
    await this.writeCollection(collection, items);
    return newItem;
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    const items = await this.readCollection<T>(collection);
    return items.find(item => (item as Record<string, unknown>).id === id) || null;
  }

  async findAll<T>(collection: string, filters?: Partial<T>): Promise<T[]> {
    let items = await this.readCollection<T>(collection);
    
    if (filters) {
      items = items.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          return (item as Record<string, unknown>)[key] === value;
        });
      });
    }
    
    return items;
  }

  async update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    const items = await this.readCollection<T>(collection);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await this.writeCollection(collection, items);
    return items[index];
  }

  async delete<T extends { id: string }>(collection: string, id: string): Promise<boolean> {
    const items = await this.readCollection<T>(collection);
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) return false;
    
    await this.writeCollection(collection, filteredItems);
    return true;
  }

  // Specific methods for each collection
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.create<User>(dbConfig.collections.users, userData);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.findById<User>(dbConfig.collections.users, id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.findAll<User>(dbConfig.collections.users);
    return users.find(user => user.email === email) || null;
  }

  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<Post> {
    return this.create<Post>(dbConfig.collections.posts, {
      ...postData,
      viewCount: 0,
    });
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.findById<Post>(dbConfig.collections.posts, id);
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    const posts = await this.findAll<Post>(dbConfig.collections.posts);
    return posts.find(post => post.slug === slug) || null;
  }

  async getPublishedPosts(): Promise<Post[]> {
    return this.findAll<Post>(dbConfig.collections.posts, { status: 'published' });
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    return this.create<Category>(dbConfig.collections.categories, categoryData);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.findById<Category>(dbConfig.collections.categories, id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = await this.findAll<Category>(dbConfig.collections.categories);
    return categories.find(category => category.slug === slug) || null;
  }

  async getSiteSettings(): Promise<SiteSettings | null> {
    const settings = await this.readCollection<SiteSettings>(dbConfig.collections.settings);
    return settings[0] || null;
  }

  async updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const settings = await this.readCollection<SiteSettings>(dbConfig.collections.settings);
    
    if (settings.length === 0) {
      const newSettings = {
        id: this.generateId(),
        siteName: 'My Next.js App',
        siteDescription: 'A modern Next.js application',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        socialMedia: {},
        seo: {
          defaultTitle: 'My Next.js App',
          defaultDescription: 'A modern Next.js application',
          defaultKeywords: ['nextjs', 'react', 'typescript'],
        },
        updatedAt: new Date().toISOString(),
        ...updates,
      } as SiteSettings;
      
      await this.writeCollection(dbConfig.collections.settings, [newSettings]);
      return newSettings;
    }
    
    settings[0] = {
      ...settings[0],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await this.writeCollection(dbConfig.collections.settings, settings);
    return settings[0];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}

export const db = new Database();
