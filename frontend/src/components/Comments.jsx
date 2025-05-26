"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Edit2, Trash2, Send } from "lucide-react"
import { getComments, createComment, updateComment, deleteComment } from "../API.js"
import { getUser } from "../API.js"
import * as jwt_decode from "jwt-decode"


export function Comments({ recipeId, recipe }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [ isOwner, setIsOwner ] =useState(false)
  const [currentUserId, setCurrentUserId] = useState(null);
  const [ isCommentOwner, setIsCOmmentOwner ] =useState(false)
  

  
    useEffect(() => {
      
      async function loadUser() {
        const userData = await getUser(recipe.author); // Apelezi funcția getUser cu ID-ul utilizatorului
        if (userData) {
          setUser(userData);
        }
      }
  
      // Check if current user owns this recipe
      function checkOwnership() {
        try {
          const token = sessionStorage.getItem("User")
          if (token) {
            const decodedUser = jwt_decode.jwtDecode(token)
            setIsOwner(recipe.author === decodedUser._id)
            setCurrentUserId(decodedUser._id)
          }
        } catch (error) {
          console.error("Error checking ownership:", error)
        }
      }
  
      loadUser(); // Încarci utilizatorul după ce componentele s-au montat
      checkOwnership(); // Verifici dacă utilizatorul curent deține rețeta
    }, [recipeId]);

  useEffect(() => {
    
   loadComments()
  }, [recipeId])

   async function loadComments() {
        try {
        setLoading(true)
        const data = await getComments(recipeId)
        setComments(data || [])
        } catch (err) {
        console.error("Error loading comments:", err)
        setError("Failed to load comments")
        } finally {
        setLoading(false)
        }
    }

    

  async function handleSubmitComment(e) {
    e.preventDefault()

    if (!newComment.trim()) {
      setError("Please enter a comment")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const commentData = {
        recipeId: recipeId,
        comment: newComment.trim(),
      }

      await createComment(commentData)
      setNewComment("")
      await loadComments() // Reload comments
    } catch (err) {
      console.error("Error creating comment:", err)
      setError("Failed to post comment")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEditComment(commentId) {
    if (!editText.trim()) {
      setError("Please enter a comment")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      await updateComment(commentId, { comment: editText.trim() })
      setEditingComment(null)
      setEditText("")
      await loadComments() // Reload comments
    } catch (err) {
      console.error("Error updating comment:", err)
      setError("Failed to update comment")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      await deleteComment(commentId)
      await loadComments() // Reload comments
    } catch (err) {
      console.error("Error deleting comment:", err)
      setError("Failed to delete comment")
    } finally {
      setSubmitting(false)
    }
  }

  function startEditing(comment) {
    setEditingComment(comment._id)
    setEditText(comment.comment)
  }

  function cancelEditing() {
    setEditingComment(null)
    setEditText("")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>
          <MessageCircle size={20} />
          Comments ({comments.length})
        </h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Add new comment form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="comment-input-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              rows="3"
              maxLength="500"
              disabled={submitting}
            />
            <button type="submit" disabled={submitting || !newComment.trim()} className="submit-comment-btn">
              <Send size={16} />
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}

      {/* Comments list */}
      <div className="comments-list">
        {loading && (
          <div className="comments-loading">
            <p>Loading comments...</p>
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="no-comments">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}

        {!loading && comments.length > 0 && (
          <>
            {comments.map((comment) => {
             const isCommentOwner = comment.userId === currentUserId;
              return(
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author">
                    <strong>{comment.userName}</strong>
                    <span className="comment-date">{formatDate(comment.dateCreated)}</span>
                    {comment.dateUpdated && <span className="comment-edited">(edited)</span>}
                  </div>

                   {isCommentOwner && (
                    <div className="comment-actions">
                      <button onClick={() => startEditing(comment)} className="edit-comment-btn" disabled={submitting}>
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}

                  {isOwner && (
                    <div className="comment-actions">
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="delete-comment-btn"
                        disabled={submitting}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="comment-content">
                  {editingComment === comment._id ? (
                    <div className="edit-comment-form">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows="3"
                        maxLength="500"
                        disabled={submitting}
                      />
                      <div className="edit-comment-actions">
                        <button
                          onClick={() => handleEditComment(comment._id)}
                          disabled={submitting || !editText.trim()}
                          className="save-edit-btn"
                        >
                          Save
                        </button>
                        <button onClick={cancelEditing} disabled={submitting} className="cancel-edit-btn">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>{comment.comment}</p>
                  )}
                </div>
              </div>
        ) })}
          </>
        )}
      </div>
    </div>
  )
}
