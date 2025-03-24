"use client";
import { useState } from "react";
import { Search, Briefcase, MapPin, Code, Award, Loader2 } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { useForm, zodResolver } from "@workspace/ui/hooks";
import {
  JobSearchFormValues,
  jobSearchSchema,
} from "@repo/validations/src/job-search-validation";
import { Checkbox } from "@workspace/ui/components/checkbox";

// Job search form component
export default function JobSearchForm() {
  // State for loading
  const [isSearching, setIsSearching] = useState(false);

  // Form
  const form = useForm<JobSearchFormValues>({
    resolver: zodResolver(jobSearchSchema),
    defaultValues: {
      jobTitle: "",
      location: "",
      jobType: "All Types",
      skills: [],
      showAiMatches: false,
    },
  });

  // Handle submit
  async function onSubmit(values: JobSearchFormValues) {
    if (form.formState.isValid) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
      }, 3000);
    }

    console.log(values);

    // Set the values in the URL query string
    const searchParams = new URLSearchParams();
    if (values.jobTitle) searchParams.set("jobTitle", values.jobTitle);
    if (values.location) searchParams.set("location", values.location);
    if (values.jobType) searchParams.set("jobType", values.jobType);
    if (values.showAiMatches)
      searchParams.set("showAiMatches", values.showAiMatches.toString());
    if (values.skills && values.skills.length > 0)
      searchParams.set("skills", values.skills.join(","));

    // Push the new URL to the browser history
    window.history.pushState({}, "", `?${searchParams.toString()}`);
  }

  // Render the form
  return (
    <div className="w-full bg-black text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Find Your Dream Job
        </h1>
        <div className="w-32 h-1 bg-primary mx-auto mb-6"></div>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Our AI-powered search engine scans thousands of listings to find
          opportunities that match your unique skills and preferences.
        </p>
      </div>

      <div className="w-full max-w-4xl bg-zinc-900 rounded-lg p-6 md:p-8 shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <div className="relative focus-within:scale-105 transition-all ease-in-out duration-300">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <FormControl>
                        <Input
                          placeholder="e.g. New York or Remote"
                          className="pl-10 bg-zinc-800 border-zinc-700 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <div className="relative focus-within:scale-105 transition-all ease-in-out duration-300">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <FormControl>
                        <Input
                          placeholder="e.g. New York or Remote"
                          className="pl-10 bg-zinc-800 border-zinc-700 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <div className="relative w-full">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                        <FormControl>
                          <SelectTrigger className="pl-10 bg-zinc-800 border-zinc-700 text-white focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectItem value="All Types">All Types</SelectItem>
                          <SelectItem value="Full-Time">Full-Time</SelectItem>
                          <SelectItem value="Part-Time">Part-Time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <div className="relative focus-within:scale-105 transition-all ease-in-out duration-300">
                      <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <FormControl>
                        <Input
                          placeholder="e.g. JavaScript, React, Node.js"
                          className="pl-10 bg-zinc-800 border-zinc-700 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                          onChange={(e) => {
                            // Add onChange event handler
                            const skills = e.target.value.split(","); // Split the input value by comma
                            field.onChange(skills); // Call the field.onChange method with the new value
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="showAiMatches"
                render={({ field }) => (
                  <FormItem className="flex items-center ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="bg-zinc-800 border-primary focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormLabel>Show AI Matches</FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="text-black font-medium px-6 shadow-md hover:shadow-primary duration-500 hover:scale-105 transition-all ease-in-out"
                disabled={form.formState.isSubmitting || isSearching}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Searching...
                  </>
                ) : (
                  <>
                    Find Jobs <Search className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
