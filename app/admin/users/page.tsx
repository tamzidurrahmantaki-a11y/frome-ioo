import { getUsers } from '@/app/actions/admin/get-users'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const { data: users, error } = await getUsers()

    if (error) {
        return <div className="p-4 text-red-500">Error loading users: {error}</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2 italic uppercase">Users Directory</h1>
                <p className="text-muted-foreground font-medium">Manage and view all registered users across the platform.</p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-2xl shadow-black/40">
                <Table>
                    <TableHeader className="bg-background/50 border-b border-border/50">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Links</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(users) && users.map((user: any) => (
                            <TableRow key={user.id} className="hover:bg-muted/50 border-border">
                                <TableCell>
                                    <Avatar className="w-9 h-9 border border-gray-100 dark:border-zinc-800">
                                        <AvatarImage src={user.avatar_url} />
                                        <AvatarFallback className="text-xs bg-gray-100 dark:bg-zinc-800">
                                            {(user.email?.[0] || 'U').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-foreground text-sm tracking-tight">
                                            {user.full_name || (user.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'Unknown User')}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground/60">{user.email || 'No Email'}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {user.country && user.country !== 'Unknown' ? (
                                            <>
                                                <span className="text-base">🌍</span>
                                                <span className="text-sm text-foreground font-medium">{user.country}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-base" title="Global / Unknown">🌐</span>
                                                <span className="text-sm text-muted-foreground italic">Global</span>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-normal border-border bg-background">
                                        {user.subscription_plan || 'Free'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm font-bold text-muted-foreground">{user.linkCount || 0}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-[12px] font-medium text-muted-foreground/50">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold text-[10px] uppercase tracking-widest">
                                        Active
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
