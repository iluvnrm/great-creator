import { useNavigate } from 'react-router-dom'
import { useGuildStore } from '../store/guild'
import { useAuthStore } from '../store/auth'
import { useEffect, useState } from 'react'
import { guildsAPI } from '../api/endpoints'
import { Card, Button } from '../components'
import { Plus, Settings, LogOut } from 'lucide-react'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const guilds = useGuildStore((state) => state.guilds)
  const setGuilds = useGuildStore((state) => state.setGuilds)
  const selectGuild = useGuildStore((state) => state.selectGuild)
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const response = await guildsAPI.getAll()
        setGuilds(response.data)
      } catch (error) {
        console.error('Failed to fetch guilds:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGuilds()
  }, [setGuilds])

  const handleSelectGuild = (guild: any) => {
    selectGuild(guild)
    navigate(`/guild/${guild.guild_id}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Great Creator</h1>
            <p className="text-slate-400 text-sm">Welcome, {user?.username}</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Servers</h2>
            <p className="text-slate-400">Manage and customize your Discord servers</p>
          </div>
          <Button variant="primary" className="gap-2">
            <Plus size={18} />
            Add Server
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-slate-400 mt-4">Loading your servers...</p>
          </div>
        ) : guilds.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-400 mb-4">No servers found</p>
            <Button variant="primary">Add Your First Server</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guilds.map((guild) => (
              <Card
                key={guild.id}
                className="cursor-pointer hover:border-blue-500/50 group"
                onClick={() => handleSelectGuild(guild)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                      {guild.name}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">ID: {guild.guild_id}</p>
                  </div>
                  {guild.icon && (
                    <img
                      src={guild.icon}
                      alt={guild.name}
                      className="w-12 h-12 rounded-lg ml-4"
                    />
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSelectGuild(guild)}
                  >
                    Manage
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
