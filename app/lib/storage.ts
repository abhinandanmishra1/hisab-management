import type { Group } from "@/types"

const STORAGE_KEY = "hisab-groups"

export function getGroups(): Group[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveGroup(group: Group) {
  const groups = getGroups()
  const index = groups.findIndex((g) => g.id === group.id)

  if (index >= 0) {
    groups[index] = group
  } else {
    groups.push(group)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
}

export function getGroup(id: string): Group | undefined {
  return getGroups().find((g) => g.id === id)
}

