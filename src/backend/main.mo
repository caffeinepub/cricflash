import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Order "mo:core/Order";

import Runtime "mo:core/Runtime";


actor {
  include MixinStorage();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // USER PROFILE TYPES
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ARTICLE TYPES
  type Article = {
    id : Text;
    title : Text;
    content : Text;
    author : Principal;
    createdAt : Int;
    category : Text;
    imageUrl : Text;
    slug : Text;
    status : Text;
  };

  module Article {
    public func compareByCreatedAt(article1 : Article, article2 : Article) : Order.Order {
      Int.compare(article2.createdAt, article1.createdAt);
    };
  };

  // Persistent data structure for articles
  let articles = Map.empty<Text, Article>();

  // CRUD OPERATIONS

  public shared ({ caller }) func createArticle(title : Text, content : Text, category : Text, imageUrl : Text, slug : Text, status : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create articles");
    };
    let timestamp = Time.now();
    let articleId = timestamp.toText();
    let newArticle : Article = {
      id = articleId;
      title;
      content;
      author = caller;
      createdAt = timestamp;
      category;
      imageUrl;
      slug;
      status;
    };

    articles.add(articleId, newArticle);
    articleId;
  };

  public query ({ caller }) func getArticles() : async [Article] {
    let allArticles = articles.values().toArray();
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    // Filter articles based on authorization
    let filteredArticles = allArticles.filter(
      func(article : Article) : Bool {
        // Published articles are visible to everyone
        if (article.status == "published") {
          return true;
        };
        // Draft articles only visible to author or admin
        if (article.status == "draft") {
          return article.author == caller or isAdmin;
        };
        false;
      }
    );
    
    filteredArticles.sort(Article.compareByCreatedAt);
  };

  public query ({ caller }) func getArticle(id : Text) : async ?Article {
    let article = articles.get(id);
    switch (article) {
      case (null) { null };
      case (?art) {
        // Published articles are visible to everyone
        if (art.status == "published") {
          return ?art;
        };
        // Draft articles only visible to author or admin
        if (art.status == "draft") {
          if (art.author == caller or AccessControl.isAdmin(accessControlState, caller)) {
            return ?art;
          };
        };
        null;
      };
    };
  };

  public shared ({ caller }) func deleteArticle(id : Text) : async () {
    let article = switch (articles.get(id)) {
      case (null) {
        Runtime.trap("Article not found");
      };
      case (?article) { article };
    };
    if (article.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the author or admin can delete this article");
    };
    articles.remove(id);
  };

  public shared ({ caller }) func updateArticle(id : Text, title : Text, content : Text, category : Text, imageUrl : Text, slug : Text, status : Text) : async Article {
    let article = switch (articles.get(id)) {
      case (null) {
        Runtime.trap("Article not found");
      };
      case (?article) { article };
    };
    if (article.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the author or admin can update this article");
    };
    let updatedArticle : Article = {
      id;
      title;
      content;
      author = article.author;
      createdAt = article.createdAt;
      category;
      imageUrl;
      slug;
      status;
    };
    articles.add(id, updatedArticle);
    updatedArticle;
  };
};
