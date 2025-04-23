import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Page, contentAPI } from "../../lib/api";
import { Save, ArrowLeft, Eye, Trash2 } from "lucide-react";
import { CONTENT_STATUS } from "../../constants/app.constants";

const PageEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [page, setPage] = useState<Page>({
    title: "",
    slug: "",
    content: "",
    status: "draft",
  });

  // Load page data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchPage(id);
    }
  }, [id, isEditing]);

  const fetchPage = async (pageId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await contentAPI.getPageById(pageId);
      setPage(response);
    } catch (error) {
      console.error("Error fetching page:", error);
      setError(
        "Failed to load page. It may have been deleted or you don't have permission to view it."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = () => {
    if (!page.title) return;

    const slug = page.title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");

    setPage((prev) => ({
      ...prev,
      slug,
    }));
  };

  const handleSave = async (newStatus?: "draft" | "published") => {
    if (!page.title) {
      setError("Title is required");
      return;
    }

    if (!page.slug) {
      generateSlug();
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const pageToSave = {
        ...page,
        status: newStatus || page.status,
      };

      if (isEditing && id) {
        await contentAPI.updatePage(id, pageToSave);
        setSuccess("Page updated successfully!");
      } else {
        const response = await contentAPI.createPage(pageToSave);
        setSuccess("Page created successfully!");
        // Redirect to edit page after creation
        navigate(`/cms/pages/${response.id}`);
      }
    } catch (error) {
      console.error("Error saving page:", error);
      setError("Failed to save page. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !isEditing) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this page? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await contentAPI.deletePage(id);
      navigate("/cms/pages", {
        state: { message: "Page deleted successfully" },
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      setError("Failed to delete page. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-gray-500 dark:text-gray-400">Loading page...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cms/pages")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit Page" : "Create New Page"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditing
                ? "Make changes to your page content"
                : "Create a new page for your website"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {isEditing && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" /> Save Draft
          </Button>

          <Button
            className="flex items-center gap-2"
            onClick={() => handleSave("published")}
            disabled={isSaving}
          >
            <Eye className="h-4 w-4" /> {isSaving ? "Saving..." : "Publish"}
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md">
          {success}
        </div>
      )}

      {/* Editor Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 space-y-6">
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Page Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={page.title}
              onChange={handleChange}
              onBlur={() => !page.slug && generateSlug()}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              placeholder="Enter page title"
              required
            />
          </div>

          {/* Slug Field */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              URL Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                /
              </span>
              <input
                id="slug"
                name="slug"
                type="text"
                value={page.slug}
                onChange={handleChange}
                className="block w-full flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                placeholder="page-url-slug"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              The URL slug will be automatically generated from the title if
              left empty.
            </p>
          </div>

          {/* Status Field */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={page.status}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value={CONTENT_STATUS.DRAFT}>Draft</option>
              <option value={CONTENT_STATUS.PUBLISHED}>Published</option>
            </select>
          </div>

          {/* Content Field */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              value={page.content}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              placeholder="Enter page content"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
