import { type CollectionEntry, getCollection } from "astro:content";
import { siteConfig } from "@/site-config";

/** filter out draft posts based on the environment */
export async function getAllPosts2() {
	return await getCollection("post2", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

/** returns the date of the post based on option in siteConfig.sortPostsByUpdatedDate */
export function getPostSortDate(post: CollectionEntry<"post2">) {
	return siteConfig.sortPostsByUpdatedDate && post.data.updatedDate !== undefined
		? new Date(post.data.updatedDate)
		: new Date(post.data.publishDate);
}

/** sort post by date (by siteConfig.sortPostsByUpdatedDate), desc.*/
export function sortMDByDate2(posts: CollectionEntry<"post2">[]) {
	return posts.sort((a, b) => {
		const aDate = getPostSortDate(a).valueOf();
		const bDate = getPostSortDate(b).valueOf();
		return bDate - aDate;
	});
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key */
export function groupPostsByYear2(posts: CollectionEntry<"post2">[]) {
	return posts.reduce<Record<string, CollectionEntry<"post2">[]>>((acc, post) => {
		const year = getPostSortDate(post).getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year]?.push(post);
		return acc;
	}, {});
}

/** returns all tags created from posts (inc duplicate tags) */
export function getAllTags2(posts: CollectionEntry<"post2">[]) {
	return posts.flatMap((post) => [...post.data.tags]);
}

/** returns all unique tags created from posts */
export function getUniqueTags2(posts: CollectionEntry<"post2">[]) {
	return [...new Set(getAllTags2(posts))];
}

/** returns a count of each unique tag - [[tagName, count], ...] */
export function getUniqueTagsWithCount2(posts: CollectionEntry<"post2">[]): [string, number][] {
	return [
		...getAllTags2(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}