'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  X, 
  FileText, 
  Calendar,
  User,
  Building,
  Clock,
  Tag,
  Save,
  Loader2
} from 'lucide-react';
import { submitArticle } from '@/lib/article-service';

interface ArticleFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  institution: string;
  keyFindings: string[];
  readTime: string;
  content: string;
}

const categories = [
  'Public Health Research',
  'Clinical Research',
  'Epidemiology',
  'Health Policy',
  'Medical Technology',
  'Disease Prevention',
  'Healthcare Systems',
  'Mental Health',
  'Pediatric Medicine',
  'Geriatric Care',
  'Clinical Data Analysis',
  'Health Informatics'
];

const getMarkdownTemplate = () => `# Introduction

Brief introduction to the research topic and its significance.

## Background

Provide context and background information about the research area.

## Methodology

Describe the research methods, data collection, and analysis approach.

## Key Findings

• **Finding 1**: Description of the first key finding
• **Finding 2**: Description of the second key finding  
• **Finding 3**: Description of the third key finding

## Results

Present the main results and findings from the research.

### Statistical Analysis

Include relevant statistics and data analysis.

### Data Table

| Metric | Value | Percentage | Source |
|--------|-------|------------|--------|
| Sample Size | 1,000 | 100% | Primary Data |
| Response Rate | 850 | 85% | Survey Results |
| Confidence Level | 95% | ±2.5% | Statistical Analysis |

### Comparative Analysis

Compare findings with existing research or benchmarks.

## Discussion

Discuss the implications of the findings and their significance.

### Clinical Implications

How the findings impact clinical practice.

### Policy Implications

How the findings might influence health policy.

## Limitations

Acknowledge any limitations of the research.

## Future Directions

Suggest areas for future research and development.

## Conclusion

Summarize the main findings and their importance.

## References

1. [Reference Title 1](https://example.com/reference1) - Author Name, Journal, Year
2. [Reference Title 2](https://example.com/reference2) - Author Name, Journal, Year  
3. [Reference Title 3](https://example.com/reference3) - Author Name, Journal, Year

## Additional Resources

• [Related Research Paper](https://example.com/related-paper)
• [Clinical Guidelines](https://example.com/guidelines)
• [Data Repository](https://example.com/data)

---
*This research was conducted by ClinicalForge Platform.*`;

export default function ArticleSubmissionForm({ onSuccess, onCancel }: { 
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    description: '',
    category: '',
    tags: [],
    institution: '',
    keyFindings: [''],
    readTime: '',
    content: getMarkdownTemplate()
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newFinding, setNewFinding] = useState('');

  const handleInputChange = (field: keyof ArticleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof ArticleFormData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] as string[] ? 
        (prev[field] as string[]).map((item, i) => i === index ? value : item) : 
        [value]
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const addFinding = () => {
    if (newFinding.trim()) {
      setFormData(prev => ({ ...prev, keyFindings: [...prev.keyFindings, newFinding.trim()] }));
      setNewFinding('');
    }
  };

  const removeFinding = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      keyFindings: prev.keyFindings.filter((_, i) => i !== index) 
    }));
  };

  const calculateReadTime = (content: string) => {
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200); // 200 words per minute
    return `${minutes} min read`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate read time based on content
      const readTime = calculateReadTime(formData.content);

             const articleData = {
         title: formData.title,
         description: formData.description,
         category: formData.category,
         tags: formData.tags,
         author: 'ClinicalForge',
         institution: formData.institution,
         impact: 'Established framework for clinical data collection',
         methodology: 'Comprehensive research and analysis',
         keyFindings: formData.keyFindings.filter(finding => finding.trim()),
         datasetSize: 'Research Study',
         readTime,
         content: formData.content,
         status: 'published' as const,
         publishDate: new Date().toISOString().split('T')[0],
         contributors: 1,
         citations: 0
       };

      await submitArticle(articleData);
      
             // Reset form
       setFormData({
         title: '',
         description: '',
         category: '',
         tags: [],
         institution: '',
         keyFindings: [''],
         readTime: '',
         content: getMarkdownTemplate()
       });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      alert('Failed to submit article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Add New Article</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter article title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the article"
                rows={3}
                required
              />
            </div>

            {/* Institution Information */}
            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                placeholder="Institution name"
                required
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>



            {/* Key Findings */}
            <div className="space-y-2">
              <Label>Key Findings</Label>
              {formData.keyFindings.map((finding, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={finding}
                    onChange={(e) => handleArrayChange('keyFindings', index, e.target.value)}
                    placeholder={`Key finding ${index + 1}`}
                  />
                  <Button
                    type="button"
                    onClick={() => removeFinding(index)}
                    variant="outline"
                    size="sm"
                    disabled={formData.keyFindings.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  value={newFinding}
                  onChange={(e) => setNewFinding(e.target.value)}
                  placeholder="Add a key finding"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFinding())}
                />
                <Button type="button" onClick={addFinding} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Article Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Edit the markdown template below to create your article..."
                rows={20}
                required
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500">
                Estimated read time: {calculateReadTime(formData.content)}
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p><strong>Markdown Template Features:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>#</code> for main headings (H1)</li>
                  <li><code>##</code> for subheadings (H2)</li>
                  <li><code>###</code> for sub-subheadings (H3)</li>
                  <li><code>**text**</code> for bold text</li>
                  <li><code>• item</code> for bullet points</li>
                  <li><code>1. item</code> for numbered lists</li>
                  <li><code>[text](url)</code> for links</li>
                  <li><code>| col1 | col2 |</code> for tables</li>
                  <li><code>---</code> for horizontal rules</li>
                  <li><code>*text*</code> for italic text</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Article
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 