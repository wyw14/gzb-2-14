<template>
  <div class="admin-categories">
    <div class="card">
      <div class="page-header">
        <h1 class="page-title">分类管理</h1>
        <el-button type="primary" @click="showAddDomain = true">
          <el-icon><Plus /></el-icon>添加领域
        </el-button>
      </div>

      <div v-for="domain in categories" :key="domain.id" class="domain-block">
        <div class="domain-header">
          <div class="domain-info">
            <span class="domain-icon">{{ domain.icon }}</span>
            <span class="domain-name">{{ domain.name }}</span>
            <span class="domain-id">({{ domain.id }})</span>
            <el-tag :type="domain.active ? 'success' : 'danger'" size="small">
              {{ domain.active ? '已启用' : '已停用' }}
            </el-tag>
            <span class="dir-count">{{ domain.directions.length }} 个方向</span>
          </div>
          <div class="domain-actions">
            <el-button size="small" @click="openEditDomain(domain)">编辑</el-button>
            <el-button
              size="small"
              :type="domain.active ? 'warning' : 'success'"
              @click="toggleDomain(domain)"
            >
              {{ domain.active ? '停用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" @click="deleteDomain(domain)">删除</el-button>
            <el-button size="small" type="primary" @click="openAddDirection(domain)">
              <el-icon><Plus /></el-icon>添加方向
            </el-button>
          </div>
        </div>

        <div class="directions-list">
          <div v-for="dir in domain.directions" :key="dir.id" class="direction-item">
            <div class="direction-info">
              <span class="direction-name">{{ dir.name }}</span>
              <span class="direction-id">({{ dir.id }})</span>
              <el-tag :type="dir.active ? 'success' : 'danger'" size="small">
                {{ dir.active ? '已启用' : '已停用' }}
              </el-tag>
            </div>
            <div class="direction-actions">
              <el-button size="small" @click="openEditDirection(domain, dir)">编辑</el-button>
              <el-button
                size="small"
                :type="dir.active ? 'warning' : 'success'"
                @click="toggleDirection(domain, dir)"
              >
                {{ dir.active ? '停用' : '启用' }}
              </el-button>
              <el-button size="small" type="danger" @click="deleteDirection(domain, dir)">删除</el-button>
            </div>
          </div>
          <el-empty v-if="domain.directions.length === 0" description="暂无方向" :image-size="60" />
        </div>
      </div>

      <el-empty v-if="categories.length === 0" description="暂无分类数据" />
    </div>

    <el-dialog v-model="showAddDomain" title="添加领域" width="500px" @close="resetDomainForm">
      <el-form :model="domainForm" label-position="top">
        <el-form-item label="领域ID" required>
          <el-input v-model="domainForm.id" placeholder="例如：programming" />
        </el-form-item>
        <el-form-item label="领域名称" required>
          <el-input v-model="domainForm.name" placeholder="例如：编程开发" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="domainForm.icon" placeholder="例如：💻" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDomain = false">取消</el-button>
        <el-button type="primary" @click="createDomain">添加</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showEditDomain" title="编辑领域" width="500px">
      <el-form :model="editDomainForm" label-position="top">
        <el-form-item label="领域名称">
          <el-input v-model="editDomainForm.name" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="editDomainForm.icon" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDomain = false">取消</el-button>
        <el-button type="primary" @click="saveEditDomain">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showAddDir" title="添加方向" width="500px" @close="resetDirForm">
      <el-form :model="dirForm" label-position="top">
        <el-form-item label="方向ID" required>
          <el-input v-model="dirForm.id" placeholder="例如：frontend" />
        </el-form-item>
        <el-form-item label="方向名称" required>
          <el-input v-model="dirForm.name" placeholder="例如：前端开发" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDir = false">取消</el-button>
        <el-button type="primary" @click="createDirection">添加</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showEditDir" title="编辑方向" width="500px">
      <el-form :model="editDirForm" label-position="top">
        <el-form-item label="方向名称">
          <el-input v-model="editDirForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDir = false">取消</el-button>
        <el-button type="primary" @click="saveEditDirection">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoryAPI } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const categories = ref([])
const showAddDomain = ref(false)
const showEditDomain = ref(false)
const showAddDir = ref(false)
const showEditDir = ref(false)
const currentDomain = ref(null)
const currentDirection = ref(null)

const domainForm = ref({ id: '', name: '', icon: '📁' })
const editDomainForm = ref({ name: '', icon: '' })
const dirForm = ref({ id: '', name: '' })
const editDirForm = ref({ name: '' })

onMounted(() => {
  loadCategories()
})

async function loadCategories() {
  const res = await categoryAPI.getCategories()
  categories.value = res.data
}

function resetDomainForm() {
  domainForm.value = { id: '', name: '', icon: '📁' }
}

function resetDirForm() {
  dirForm.value = { id: '', name: '' }
}

async function createDomain() {
  if (!domainForm.value.id || !domainForm.value.name) {
    return ElMessage.warning('请填写领域ID和名称')
  }
  try {
    await categoryAPI.createCategory(domainForm.value)
    ElMessage.success('添加成功')
    showAddDomain.value = false
    resetDomainForm()
    await loadCategories()
  } catch (e) {
    ElMessage.error(e.message || '添加失败')
  }
}

function openEditDomain(domain) {
  currentDomain.value = domain
  editDomainForm.value = { name: domain.name, icon: domain.icon }
  showEditDomain.value = true
}

async function saveEditDomain() {
  try {
    await categoryAPI.updateCategory(currentDomain.value.id, editDomainForm.value)
    ElMessage.success('保存成功')
    showEditDomain.value = false
    await loadCategories()
  } catch (e) {
    ElMessage.error(e.message || '保存失败')
  }
}

async function toggleDomain(domain) {
  try {
    await categoryAPI.toggleCategory(domain.id)
    ElMessage.success(domain.active ? '已停用' : '已启用')
    await loadCategories()
  } catch (e) {
    ElMessage.error(e.message || '操作失败')
  }
}

async function deleteDomain(domain) {
  try {
    await ElMessageBox.confirm(`确定删除领域「${domain.name}」及其所有方向吗？`, '提示', { type: 'warning' })
    await categoryAPI.deleteCategory(domain.id)
    ElMessage.success('删除成功')
    await loadCategories()
  } catch {}
}

function openAddDirection(domain) {
  currentDomain.value = domain
  resetDirForm()
  showAddDir.value = true
}

async function createDirection() {
  if (!dirForm.value.id || !dirForm.value.name) {
    return ElMessage.warning('请填写方向ID和名称')
  }
  try {
    await categoryAPI.createDirection(currentDomain.value.id, dirForm.value)
    ElMessage.success('添加成功')
    showAddDir.value = false
    resetDirForm()
    await loadCategories()
  } catch (e) {
    ElMessage.error(e.message || '添加失败')
  }
}

function openEditDirection(domain, dir) {
  currentDomain.value = domain
  currentDirection.value = dir
  editDirForm.value = { name: dir.name }
  showEditDir.value = true
}

async function saveEditDirection() {
  try {
    await categoryAPI.updateDirection(currentDomain.value.id, currentDirection.value.id, editDirForm.value)
    ElMessage.success('保存成功')
    showEditDir.value = false
    await loadCategories()
  } catch (e) {
    ElMessage.error(e.message || '保存失败')
  }
}

async function toggleDirection(domain, dir) {
  try {
    await categoryAPI.toggleDirection(domain.id, dir.id)
    ElMessage.success(dir.active ? '已停用' : '已启用')
    await loadCategories()
  } catch (e) {
    ElMessage.error(e.message || '操作失败')
  }
}

async function deleteDirection(domain, dir) {
  try {
    await ElMessageBox.confirm(`确定删除方向「${dir.name}」吗？`, '提示', { type: 'warning' })
    await categoryAPI.deleteDirection(domain.id, dir.id)
    ElMessage.success('删除成功')
    await loadCategories()
  } catch {}
}
</script>

<style scoped>
.admin-categories {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.domain-block {
  border: 1px solid #eee;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
}

.domain-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
  gap: 12px;
}

.domain-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.domain-icon {
  font-size: 24px;
}

.domain-name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.domain-id {
  font-size: 12px;
  color: #999;
}

.dir-count {
  font-size: 12px;
  color: #667eea;
  background: #667eea15;
  padding: 2px 8px;
  border-radius: 10px;
}

.domain-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.directions-list {
  padding: 12px 20px;
}

.direction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.direction-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.direction-name {
  font-weight: 500;
  color: #333;
}

.direction-id {
  font-size: 12px;
  color: #999;
}

.direction-actions {
  display: flex;
  gap: 6px;
}
</style>
