import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string; // Anonymous display name
  content: string;
  category: 'motivation' | 'struggle' | 'success' | 'question' | 'support';
  likes: number;
  comments: Comment[];
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  mood: 'positive' | 'neutral' | 'challenging';
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  isAnonymous: boolean;
  createdAt: Date;
  likes: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatar: string;
  joinDate: Date;
  postsCount: number;
  helpfulCount: number;
  isAnonymous: boolean;
}

export class SocialService {
  private static readonly POSTS_KEY = 'community_posts';
  private static readonly COMMENTS_KEY = 'post_comments';
  private static readonly PROFILES_KEY = 'user_profiles';
  private static readonly LIKES_KEY = 'user_likes';

  // Generate anonymous display name
  static generateAnonymousName(): string {
    const adjectives = ['Brave', 'Strong', 'Hopeful', 'Determined', 'Courageous', 'Resilient', 'Wise', 'Patient'];
    const nouns = ['Warrior', 'Survivor', 'Champion', 'Hero', 'Fighter', 'Spirit', 'Soul', 'Heart'];
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    
    return `${adjective}${noun}${number}`;
  }

  // Create a new community post
  static async createPost(
    authorId: string,
    content: string,
    category: CommunityPost['category'],
    isAnonymous: boolean = true,
    tags: string[] = [],
    mood: CommunityPost['mood'] = 'neutral'
  ): Promise<CommunityPost> {
    try {
      const posts = await this.getAllPosts();
      const authorName = isAnonymous ? this.generateAnonymousName() : 'User';
      
      const newPost: CommunityPost = {
        id: Date.now().toString(),
        authorId,
        authorName,
        content,
        category,
        likes: 0,
        comments: [],
        isAnonymous,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags,
        mood
      };
      
      posts.unshift(newPost); // Add to beginning
      await AsyncStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
      
      // Update user profile
      await this.updateUserPostCount(authorId);
      
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Get all posts with pagination
  static async getAllPosts(page: number = 1, limit: number = 20): Promise<CommunityPost[]> {
    try {
      const data = await AsyncStorage.getItem(this.POSTS_KEY);
      const posts: CommunityPost[] = data ? JSON.parse(data) : [];
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return posts.slice(startIndex, endIndex);
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  }

  // Get posts by category
  static async getPostsByCategory(category: CommunityPost['category']): Promise<CommunityPost[]> {
    try {
      const posts = await this.getAllPosts();
      return posts.filter(post => post.category === category);
    } catch (error) {
      console.error('Error getting posts by category:', error);
      return [];
    }
  }

  // Get posts by user
  static async getPostsByUser(userId: string): Promise<CommunityPost[]> {
    try {
      const posts = await this.getAllPosts();
      return posts.filter(post => post.authorId === userId);
    } catch (error) {
      console.error('Error getting posts by user:', error);
      return [];
    }
  }

  // Like/unlike a post
  static async toggleLike(postId: string, userId: string): Promise<boolean> {
    try {
      const posts = await this.getAllPosts();
      const postIndex = posts.findIndex(post => post.id === postId);
      
      if (postIndex === -1) return false;
      
      const userLikes = await this.getUserLikes(userId);
      const isLiked = userLikes.includes(postId);
      
      if (isLiked) {
        // Unlike
        posts[postIndex].likes = Math.max(0, posts[postIndex].likes - 1);
        const newUserLikes = userLikes.filter(id => id !== postId);
        await AsyncStorage.setItem(`${this.LIKES_KEY}_${userId}`, JSON.stringify(newUserLikes));
      } else {
        // Like
        posts[postIndex].likes += 1;
        userLikes.push(postId);
        await AsyncStorage.setItem(`${this.LIKES_KEY}_${userId}`, JSON.stringify(userLikes));
      }
      
      await AsyncStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
      return !isLiked;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  }

  // Add comment to a post
  static async addComment(
    postId: string,
    authorId: string,
    content: string,
    isAnonymous: boolean = true
  ): Promise<Comment> {
    try {
      const posts = await this.getAllPosts();
      const postIndex = posts.findIndex(post => post.id === postId);
      
      if (postIndex === -1) throw new Error('Post not found');
      
      const authorName = isAnonymous ? this.generateAnonymousName() : 'User';
      
      const newComment: Comment = {
        id: Date.now().toString(),
        postId,
        authorId,
        authorName,
        content,
        isAnonymous,
        createdAt: new Date(),
        likes: 0
      };
      
      posts[postIndex].comments.push(newComment);
      await AsyncStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Get trending posts (most liked in last 7 days)
  static async getTrendingPosts(): Promise<CommunityPost[]> {
    try {
      const posts = await this.getAllPosts();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      return posts
        .filter(post => new Date(post.createdAt) > oneWeekAgo)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 10);
    } catch (error) {
      console.error('Error getting trending posts:', error);
      return [];
    }
  }

  // Search posts by content or tags
  static async searchPosts(query: string): Promise<CommunityPost[]> {
    try {
      const posts = await this.getAllPosts();
      const lowercaseQuery = query.toLowerCase();
      
      return posts.filter(post => 
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        post.authorName.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(`${this.PROFILES_KEY}_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Create or update user profile
  static async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const existingProfile = await this.getUserProfile(userId);
      const updatedProfile: UserProfile = {
        id: userId,
        displayName: profile.displayName || existingProfile?.displayName || this.generateAnonymousName(),
        avatar: profile.avatar || existingProfile?.avatar || '👤',
        joinDate: existingProfile?.joinDate || new Date(),
        postsCount: profile.postsCount || existingProfile?.postsCount || 0,
        helpfulCount: profile.helpfulCount || existingProfile?.helpfulCount || 0,
        isAnonymous: profile.isAnonymous ?? existingProfile?.isAnonymous ?? true
      };
      
      await AsyncStorage.setItem(`${this.PROFILES_KEY}_${userId}`, JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Update user post count
  static async updateUserPostCount(userId: string): Promise<void> {
    try {
      const profile = await this.getUserProfile(userId);
      if (profile) {
        profile.postsCount += 1;
        await this.updateUserProfile(userId, profile);
      }
    } catch (error) {
      console.error('Error updating user post count:', error);
    }
  }

  // Get user likes
  static async getUserLikes(userId: string): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(`${this.LIKES_KEY}_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user likes:', error);
      return [];
    }
  }

  // Get community statistics
  static async getCommunityStats(): Promise<{
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    activeUsers: number;
    topCategories: { category: string; count: number }[];
  }> {
    try {
      const posts = await this.getAllPosts();
      const totalPosts = posts.length;
      const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
      const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
      
      // Count categories
      const categoryCounts: { [key: string]: number } = {};
      posts.forEach(post => {
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
      });
      
      const topCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      // Count unique users (approximate)
      const uniqueUsers = new Set(posts.map(post => post.authorId)).size;
      
      return {
        totalPosts,
        totalComments,
        totalLikes,
        activeUsers: uniqueUsers,
        topCategories
      };
    } catch (error) {
      console.error('Error getting community stats:', error);
      return {
        totalPosts: 0,
        totalComments: 0,
        totalLikes: 0,
        activeUsers: 0,
        topCategories: []
      };
    }
  }

  // Delete a post (only by author)
  static async deletePost(postId: string, userId: string): Promise<boolean> {
    try {
      const posts = await this.getAllPosts();
      const postIndex = posts.findIndex(post => post.id === postId && post.authorId === userId);
      
      if (postIndex === -1) return false;
      
      posts.splice(postIndex, 1);
      await AsyncStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
      
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }
}

export default SocialService; 