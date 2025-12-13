"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  HiBell,
  HiXMark,
  HiCheckCircle,
  HiArrowUturnLeft,
  HiEye,
  HiFire,
  HiTrophy,
} from "react-icons/hi2";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  actor: { id: string; name: string; image: string } | null;
  metadata: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationData {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  hasMore: boolean;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch notifications
  const fetchNotifications = async (unreadOnly = false): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/notifications?unreadOnly=${unreadOnly}&limit=20`,
        { cache: "no-store" }
      );
      const result = (await response.json()) as { data: NotificationData };
      if (result.data) {
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async (): Promise<void> => {
    try {
      const response = await fetch("/api/notifications/unread-count", {
        cache: "no-store",
      });
      const result = (await response.json()) as { data: { count: number } };
      if (result.data) {
        setUnreadCount(result.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Open dropdown and fetch notifications
  const handleOpen = async (): Promise<void> => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      await fetchNotifications(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string): Promise<void> => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (
    notificationId: string,
    e: React.MouseEvent
  ): Promise<void> => {
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${notificationId}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async (): Promise<void> => {
    try {
      await fetch("/api/notifications/mark-all-read", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // Clear all notifications
  const clearAll = async (): Promise<void> => {
    if (confirm("Are you sure you want to delete all notifications?")) {
      try {
        await fetch("/api/notifications/clear-all", { method: "DELETE" });
        setNotifications([]);
        setUnreadCount(0);
      } catch (error) {
        console.error("Error clearing all notifications:", error);
      }
    }
  };

  // Handle notification click
  const handleNotificationClick = async (
    notification: Notification
  ): Promise<void> => {
    await markAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Poll for unread count every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case "post_like":
        return <HiCheckCircle className="text-red-500" />;
      case "post_comment":
        return <HiCheckCircle className="text-blue-500" />;
      case "comment_reply":
        return <HiArrowUturnLeft className="text-purple-500" />;
      case "comment_like":
        return <HiCheckCircle className="text-pink-500" />;
      case "list_public":
        return <HiEye className="text-green-500" />;
      case "goal_milestone":
        return <HiTrophy className="text-yellow-500" />;
      case "streak_achievement":
        return <HiFire className="text-orange-500" />;
      default:
        return <HiBell className="text-gray-500" />;
    }
  };

  const getBackgroundForType = (type: string): string => {
    switch (type) {
      case "post_like":
        return "bg-red-100";
      case "post_comment":
        return "bg-blue-100";
      case "comment_reply":
        return "bg-purple-100";
      case "comment_like":
        return "bg-pink-100";
      case "list_public":
        return "bg-green-100";
      case "goal_milestone":
        return "bg-yellow-100";
      case "streak_achievement":
        return "bg-orange-100";
      default:
        return "bg-gray-100";
    }
  };

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className={`relative p-2 rounded-full transition-colors ${
          isOpen ? "bg-accent/10 text-accent" : "hover:bg-midnight/5"
        }`}
        aria-label="Notifications"
      >
        <HiBell className="size-6 text-midnight" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 min-w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h3 className="font-bold text-lg text-midnight">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-accent hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <HiXMark className="size-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex px-4 border-b">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "all"
                  ? "text-accent border-accent"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                activeTab === "unread"
                  ? "text-accent border-accent"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="absolute -top-1 right-0 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto max-h-80">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <HiBell className="size-16 text-gray-300 mx-auto mb-2 opacity-50" />
                <p className="text-gray-600 text-sm">No notifications yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  We'll notify you when something happens
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex gap-3 p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-accent/5" : ""
                  }`}
                >
                  {/* Icon/Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getBackgroundForType(
                      notification.type
                    )}`}
                  >
                    {notification.actor?.image ? (
                      <Image
                        src={notification.actor.image}
                        alt={notification.actor.name}
                        width={40}
                        height={40}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-lg">
                        {getIconForType(notification.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-midnight line-clamp-2">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>

                  {/* Right Section */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    )}
                    <button
                      onClick={(e) => deleteNotification(notification.id, e)}
                      className="p-1 hover:bg-red-100 hover:text-red-600 rounded opacity-0 hover:opacity-100 group-hover:opacity-100"
                    >
                      <HiXMark className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t flex justify-between items-center">
              <Link
                href="/notifications"
                className="text-sm text-accent hover:underline font-medium"
              >
                View all notifications
              </Link>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
