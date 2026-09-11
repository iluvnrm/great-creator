import { useParams, useNavigate } from 'react-router-dom'
import { useGuildStore } from '../store/guild'
import { useEffect, useState } from 'react'
import { channelsAPI, rolesAPI, membersAPI } from '../api/endpoints'
import { Card, Button } from '../components'
import { ChevronLeft, Plus, Trash2, Users, Lock, Volume2 } from 'lucide-react'
import clsx from 'clsx'

export const GuildPage = () => {
  const { guildId } = useParams()
  const navigate = useNavigate()
  const selectedGuild = useGuildStore((state) => state.selectedGuild)
  
  const [tab, setTab] = useState<'channels' | 'roles' | 'members'>('channels')
  const [channels, setChannels] = useState([])
  const [roles, setRoles] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!selectedGuild || selectedGuild.guild_id.toString() !== guildId) {
      navigate('/dashboard')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const [channelsRes, rolesRes, membersRes] = await Promise.all([
          channelsAPI.getGuildChannels(selectedGuild.guild_id),
          rolesAPI.getGuildRoles(selectedGuild.guild_id),
          membersAPI.getGuildMembers(selectedGuild.guild_id),
        ])
        
        setChannels(channelsRes.data)
        setRoles(rolesRes.data)
        setMembers(membersRes.data)
      } catch (error) {
        console.error('Failed to fetch guild data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedGuild, guildId, navigate])

  if (!selectedGuild) return null

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'voice':
        return <Volume2 size={16} className="text-slate-400" />
      case 'category':
        return <Lock size={16} className="text-slate-400" />
      default:
        return <Lock size={16} className="text-slate-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <ChevronLeft size={20} className="text-slate-400" />
          </button>
          <h1 className="text-2xl font-bold text-white">{selectedGuild.name}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/30 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {['channels', 'roles', 'members'].map((tabName) => (
            <button
              key={tabName}
              onClick={() => setTab(tabName as any)}
              className={clsx(
                'py-4 px-2 font-medium border-b-2 transition-colors capitalize',
                tab === tabName
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              )}
            >
              {tabName}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white capitalize">{tab}</h2>
          <Button variant="primary" className="gap-2">
            <Plus size={18} />
            Add {tab.slice(0, -1)}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-slate-400 mt-4">Loading {tab}...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tab === 'channels' && channels.map((channel: any) => (
              <Card
                key={channel.id}
                className="flex items-center justify-between hover:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  {getChannelIcon(channel.channel_type)}
                  <div>
                    <h3 className="font-medium text-white">#{channel.name}</h3>
                    {channel.description && (
                      <p className="text-sm text-slate-400">{channel.description}</p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 size={16} className="text-red-400" />
                </Button>
              </Card>
            ))}

            {tab === 'roles' && roles.map((role: any) => (
              <Card
                key={role.id}
                className="flex items-center justify-between hover:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: role.color }}
                  ></div>
                  <div>
                    <h3 className="font-medium text-white">{role.name}</h3>
                    <p className="text-sm text-slate-400">Perms: {role.permissions}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 size={16} className="text-red-400" />
                </Button>
              </Card>
            ))}

            {tab === 'members' && members.map((member: any) => (
              <Card
                key={member.id}
                className="flex items-center justify-between hover:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.username} className="w-full h-full rounded-full" />
                    ) : (
                      <Users size={16} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{member.username}</h3>
                    <p className="text-sm text-slate-400">
                      {member.is_bot ? 'Bot' : 'User'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {member.is_banned && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                      Banned
                    </span>
                  )}
                  <Button variant="ghost" size="sm">
                    <Trash2 size={16} className="text-red-400" />
                  </Button>
                </div>
              </Card>
            ))}

            {(tab === 'channels' && channels.length === 0) ||
            (tab === 'roles' && roles.length === 0) ||
            (tab === 'members' && members.length === 0) ? (
              <Card className="text-center py-12">
                <p className="text-slate-400">No {tab} found</p>
              </Card>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
