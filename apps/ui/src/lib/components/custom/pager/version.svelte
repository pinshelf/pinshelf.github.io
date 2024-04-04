<script lang="ts">
    import { Badge } from '$lib/components/ui/badge'

    const pkg_version = __PKG_VERSION__;
</script>

<Badge variant="outline">{pkg_version}</Badge>
